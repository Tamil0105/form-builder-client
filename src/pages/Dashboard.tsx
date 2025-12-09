import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { formsService } from '../services/forms.service';
import type { Form } from '../types';
import { Plus, Edit, Trash2, BarChart, Globe, FileText } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      const data = await formsService.getUserForms();

      const normalized = data.map((f: any) => ({
        ...f,
        questions: f.fields ?? [],
      }));

      setForms(normalized);
    } catch (error) {
      console.error('Failed to load forms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return;

    try {
      await formsService.deleteForm(id);
      setForms(forms.filter((f) => f.id !== id));
    } catch (error) {
      console.error('Failed to delete form:', error);
    }
  };

  const handleTogglePublish = async (form: Form) => {
    try {
      if (form.isPublished) {
        await formsService.unpublishForm(form.id);
      } else {
        await formsService.publishForm(form.id);
      }
      loadForms();
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-10 h-10 text-blue-600" />
              My Forms
            </h1>
            <p className="text-gray-500 mt-1">Create, edit, publish & manage your forms easily.</p>
          </div>

          <Button
            onClick={() => navigate('/forms/new')}
            className="flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Create Form</span>
          </Button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
          </div>
        ) : forms.length === 0 ? (
          <Card className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 border-blue-200">
            <p className="text-gray-700 text-lg font-medium mb-3">
              You haven't created any forms yet.
            </p>
            <Button onClick={() => navigate('/forms/new')}>
              Create Your First Form
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {forms.map((form: any) => {
              const questionCount = form?.questions?.length ?? 0;

              return (
                <Card
                  key={form.id}
                  className="p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all rounded-2xl hover:-translate-y-1"
                >
                  <div className="space-y-4">

                    {/* Title + Published Badge */}
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                        {form.title}
                      </h3>

                      {form.isPublished && (
                        <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full shadow-sm">
                          Published
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {form.description}
                    </p>

                    {/* Question Count */}
                    <p className="text-xs font-medium text-gray-500 mt-1">
                      {questionCount} question{questionCount !== 1 ? 's' : ''}
                    </p>

                    {/* Buttons Section */}
                    <div className="flex flex-wrap gap-2 pt-3">

                      {/* Edit */}
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`/forms/${form.id}/edit`)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>

                      {/* Responses */}
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`/forms/${form.id}/responses`)}
                        className="flex items-center gap-1"
                      >
                        <BarChart className="w-4 h-4" />
                        Responses
                      </Button>

                      {/* View Published */}
                      {form.isPublished && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => window.open(`/forms/public/${form.id}`, '_blank')}
                          className="flex items-center gap-1"
                        >
                          <Globe className="w-4 h-4" />
                          View
                        </Button>
                      )}

                      {/* Publish / Unpublish */}
                      <Button
                        size="sm"
                        variant={form.isPublished ? 'secondary' : 'primary'}
                        onClick={() => handleTogglePublish(form)}
                        className="flex-1 text-center"
                      >
                        {form.isPublished ? 'Unpublish' : 'Publish'}
                      </Button>

                      {/* Delete */}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(form.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
