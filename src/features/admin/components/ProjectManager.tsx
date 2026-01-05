'use client';

import React from 'react';
import ProjectModal from './ProjectModal';
import ConfirmationModal from './ConfirmationModal';
import { useProjectManager } from '../hooks/useProjectManager';
import { ProjectManagerHeader } from './project-manager/ProjectManagerHeader';
import { ProjectManagerGrid } from './project-manager/ProjectManagerGrid';

export default function ProjectManager() {
  const {
    projects,
    loading,
    isModalOpen,
    editingProject,
    isSeeding,
    migrationNeeded,
    confirmation,
    setIsModalOpen,
    handleCreate,
    handleEdit,
    handleDelete,
    handleSave,
    handleSeed,
    closeConfirmation
  } = useProjectManager();

  return (
    <div className="space-y-6">
      <ProjectManagerHeader 
        handleCreate={handleCreate} 
        handleSeed={handleSeed} 
        isSeeding={isSeeding} 
        migrationNeeded={migrationNeeded} 
      />

      <ProjectManagerGrid 
        projects={projects} 
        loading={loading} 
        isSeeding={isSeeding} 
        handleEdit={handleEdit} 
        handleDelete={handleDelete} 
        handleSeed={handleSeed} 
      />

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        project={editingProject}
      />

      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        variant={confirmation.variant}
        isLoading={confirmation.isLoading}
      />
    </div>
  );
}
