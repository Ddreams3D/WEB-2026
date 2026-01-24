import os
import re
import time
import base64
from domain.models import GCodeStats
from utils.logger import Logger
from core.pattern_manager import PatternManager

class GCodeParser:
    def __init__(self, logger: Logger):
        self.logger = logger
        self.pattern_manager = PatternManager()
        self.patterns = self.pattern_manager.patterns
        self.dd_patterns = {
            'quality_profile': r"; ddreams_layer_height\s*=\s*([^\n\r]*)",
            'filament_type': r"; ddreams_filament_type\s*=\s*([^\n\r]*)",
            'printer_model': r"; ddreams_printer_model\s*=\s*([^\n\r]*)",
            'nozzle_diameter': r"; ddreams_nozzle\s*=\s*([^\n\r]*)"
        }

    def parse_file(self, file_path: str) -> GCodeStats:
        """Parses a G-code file and returns statistics."""
        stats = GCodeStats()
        content = self._read_file_safe(file_path)
        
        # DEBUG: Dump content for inspection
        try:
            debug_dir = os.path.join(os.path.dirname(file_path), "debug_dumps")
            os.makedirs(debug_dir, exist_ok=True)
            dump_path = os.path.join(debug_dir, "last_read_dump.txt")
            with open(dump_path, "w", encoding="utf-8") as f:
                f.write(f"--- START DUMP {file_path} ---\n")
                f.write(content[:5000]) # First 5000 chars
                f.write("\n\n--- END START ---\n\n")
                f.write(content[-5000:]) # Last 5000 chars
                f.write("\n--- END DUMP ---\n")
            self.logger.info(f"Debug dump saved to {dump_path}")
        except Exception as e:
            self.logger.error(f"Failed to save debug dump: {e}")

        if not content:
            self.logger.error("Empty file content read")
            return stats
        
        try:
            # 1. Regex Extraction
            self._extract_regex_data(content, stats)
        except Exception as e:
            self.logger.error(f"Error extracting regex data: {e}")
            
        try:
            # 2. DDREAMS Block (Override)
            self._extract_ddreams_data(content, stats)
        except Exception as e:
            self.logger.error(f"Error extracting DDREAMS data: {e}")
        
        try:
            # 3. Complex Logic (Time, Multicolor, Thumbnail)
            self._calculate_time(content, stats)
            self._count_color_changes(content, stats)
            self._extract_thumbnail(content, stats)
        except Exception as e:
            self.logger.error(f"Error in complex logic extraction: {e}")
        
        # 4. Inferences
        if 'Resin' in stats.printer_model or 'SLA' in stats.printer_model:
            stats.machine_type = 'RESIN'

        return stats

    def _read_file_safe(self, path: str, retries=3) -> str:
        for i in range(retries):
            try:
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    return f.read()
            except Exception as e:
                time.sleep(1)
                if i == retries - 1:
                    self.logger.error(f"Failed to read file: {e}")
                    return ""
        return ""

    def _extract_regex_data(self, content: str, stats: GCodeStats):
        for key, pat in self.patterns.items():
            if key == 'time': continue # Handled in _calculate_time
            
            match = re.search(pat, content, re.IGNORECASE)
            if match:
                # Find the first non-None group
                val = next((g for g in match.groups() if g is not None), None)
                if val:
                    val = val.strip()
                    if key == 'filament_grams': 
                        stats.grams = self._extract_float(val)
                    elif key == 'filament_meters': 
                        stats.filament_length_m = self._extract_float(val) / 1000.0
                    elif key == 'filament_type': 
                        # Remove quotes and surrounding whitespace
                        stats.filament_type = val.replace('"', '').replace("'", "").strip()
                    elif key == 'total_layers': 
                        stats.total_layers = self._extract_int(val)
                    elif key == 'printer_model': 
                        stats.printer_model = val.strip()

    def _extract_float(self, text: str) -> float:
        try:
            # Extract first number (integer or float)
            match = re.search(r'(\d+(?:\.\d+)?)', text)
            if match:
                return float(match.group(1))
        except:
            pass
        return 0.0

    def _extract_int(self, text: str) -> int:
        try:
            match = re.search(r'(\d+)', text)
            if match:
                return int(match.group(1))
        except:
            pass
        return 0

    def _extract_ddreams_data(self, content: str, stats: GCodeStats):
        for key, pat in self.dd_patterns.items():
            match = re.search(pat, content, re.IGNORECASE)
            if match:
                val = next((g for g in match.groups() if g is not None), None)
                if val:
                    cleaned_val = val.strip()
                    # Ignore template placeholders (e.g. {variable}) or garbage
                    if '{' in cleaned_val or '}' in cleaned_val:
                        continue
                    setattr(stats, key, cleaned_val)

    def _calculate_time(self, content: str, stats: GCodeStats):
        # Try to find "total estimated time" first (more accurate)
        total_time_match = re.search(r"; total estimated time:\s*([^\n\r]*)", content, re.IGNORECASE)
        val = None
        
        if total_time_match:
            val = total_time_match.group(1)
        else:
            # Fallback to model printing time
            match = re.search(self.patterns['time'], content, re.IGNORECASE)
            if match:
                val = next((g for g in match.groups() if g is not None), None)

        if val:
            val = val.strip()
            # Case 1: Standard "1h 20m 30s"
            if 'h' in val or 'm' in val or 's' in val:
                h, m, s = 0, 0, 0
                try:
                    h_match = re.search(r'(\d+)h', val)
                    if h_match: h = int(h_match.group(1))
                    
                    m_match = re.search(r'(\d+)m', val)
                    if m_match: m = int(m_match.group(1))
                    
                    s_match = re.search(r'(\d+)s', val)
                    if s_match: s = int(s_match.group(1))
                    
                    stats.time_minutes = h * 60 + m + (1 if s > 30 else 0)
                except:
                    pass
            # Case 2: HH:MM:SS
            elif ':' in val:
                try:
                    parts = [int(p) for p in val.split(':')]
                    if len(parts) == 3: # HH:MM:SS
                        stats.time_minutes = parts[0] * 60 + parts[1] + (1 if parts[2] > 30 else 0)
                    elif len(parts) == 2: 
                        stats.time_minutes = parts[0] + (1 if parts[1] > 30 else 0)
                except:
                    pass
            # Case 3: Pure Seconds (integer/float)
            else:
                try:
                    seconds = float(val)
                    stats.time_minutes = int(seconds / 60)
                except:
                    pass

    def _count_color_changes(self, content: str, stats: GCodeStats):
        # Find all T commands (T0, T1, etc.) at start of line
        t_matches = re.findall(r'(?m)^T(\d+)', content)
        
        # Filter out T255 (End script / Virtual)
        valid_tools = [t for t in t_matches if int(t) != 255]
        
        if len(valid_tools) > 1:
            # Changes = Transitions (Count - 1)
            # Example: T0 -> T1 -> T0 (3 tools called -> 2 changes)
            stats.multicolor_changes = len(valid_tools) - 1

    def _extract_thumbnail(self, content: str, stats: GCodeStats):
        thumb_match = re.search(r'; thumbnail begin \d+x\d+ \d+\n((?:.|\n)*?); thumbnail end', content)
        if thumb_match:
            stats.thumbnail_b64 = thumb_match.group(1).replace('; ', '').replace('\n', '')

    def scan_candidates(self, file_path: str) -> dict:
        """Scans the file for lines that might contain metadata."""
        candidates = {
            'time': [],
            'filament_grams': [],
            'printer_model': [],
            'filament_type': [],
            'total_layers': []
        }
        content = self._read_file_safe(file_path)
        if not content: return candidates

        for line in content.splitlines():
            line = line.strip()
            if not line.startswith(';'): continue
            if len(line) > 200: continue # Skip insanely long lines (likely binary or G-code blocks)
            
            # Simple heuristic
            lower = line.lower()
            if 'time' in lower and ('=' in line or ':' in line):
                candidates['time'].append(line)
            if ('gram' in lower or 'weight' in lower) and ('=' in line or ':' in line):
                candidates['filament_grams'].append(line)
            if 'model' in lower and ('=' in line or ':' in line) and 'printer' in lower:
                candidates['printer_model'].append(line)
            if 'filament' in lower and 'type' in lower and ('=' in line or ':' in line):
                candidates['filament_type'].append(line)
            if 'layer' in lower and 'count' in lower and ('=' in line or ':' in line):
                candidates['total_layers'].append(line)
                
        return candidates
    
    def learn_pattern(self, key: str, line: str) -> tuple[bool, str, str]:
        """Generates a regex from a user-selected line and saves it.
        Returns: (success, message, regex_generated)
        """
        # Heuristic: split by first : or =
        # Check which separator comes first
        idx_colon = line.find(':')
        idx_equal = line.find('=')
        
        sep = ''
        if idx_colon != -1 and idx_equal != -1:
            sep = ':' if idx_colon < idx_equal else '='
        elif idx_colon != -1:
            sep = ':'
        elif idx_equal != -1:
            sep = '='
            
        if not sep: 
            return False, "No se encontró un separador ':' o '=' en la línea.", ""
        
        parts = line.split(sep, 1)
        prefix = parts[0].strip()
        
        # Escape special chars but allow flexible whitespace
        # 1. Escape everything
        escaped_prefix = re.escape(prefix)
        # 2. Explicitly replace spaces with \s* (handle both escaped and non-escaped spaces)
        escaped_prefix = escaped_prefix.replace(r'\ ', r'\s*').replace(' ', r'\s*')
        
        # New regex: prefix + separator + capture group
        # We use [:=] to remain flexible even if user changes separator style later
        # Use [^\n\r]* to STRICTLY match only until end of line, avoiding multi-line captures
        new_regex = f"{escaped_prefix}\\s*[:=]\\s*([^\\n\\r]*)"
        
        # VERIFY IMMEDIATELY
        match = re.search(new_regex, line, re.IGNORECASE)
        if not match:
             return False, f"El patrón generado no coincide con la línea.\nRegex: {new_regex}", new_regex
             
        val = match.group(1).strip()
        
        # Safety check: value too long?
        if len(val) > 100:
            return False, f"El valor extraído es demasiado largo ({len(val)} chars). Probablemente sea basura o un comentario largo.\nValor: {val[:50]}...", new_regex

        self.pattern_manager.save_pattern(key, new_regex)
        self.patterns = self.pattern_manager.patterns # Update runtime
        
        return True, f"Patrón aprendido correctamente.\nValor extraído: '{val}'", new_regex
