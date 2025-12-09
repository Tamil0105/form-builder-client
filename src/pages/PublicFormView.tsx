import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { formsService } from '../services/forms.service';
import type { Form, Question } from '../types';
import { FileText, CheckCircle } from 'lucide-react';
import { getThemeColors } from '../utils/themeConfig';

export const PublicFormView: React.FC = () => {
  const { id } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Get theme colors
  const theme = getThemeColors(form?.colorTheme || 'purple');

  useEffect(() => {
    loadForm();
  }, [id]);

  const loadForm = async () => {
    if (!id) return;
    try {
      const data = await formsService.getPublicForm(id);
      setForm(data.form);
    } catch (error) {
      console.error('Failed to load form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a question should be visible based on routing rules
  const isQuestionVisible = (question: Question): boolean => {
    if (!question.routingRule) return true;

    const { sourceQuestionId, condition, value } = question.routingRule;
    const sourceResponse = responses[sourceQuestionId];

    if (sourceResponse === undefined || sourceResponse === '') return false;

    switch (condition) {
      case 'equals':
        return String(sourceResponse) === String(value);
      case 'notEquals':
        return String(sourceResponse) !== String(value);
      case 'contains':
        return String(sourceResponse).toLowerCase().includes(String(value).toLowerCase());
      default:
        return true;
    }
  };

  // Get visible questions
  const visibleQuestions = useMemo(() => {
    if (!form) return [];
    return form.fields.filter(isQuestionVisible);
  }, [form, responses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !form) return;

    // Validate only visible required fields
    const missingRequired = visibleQuestions.some(
      (q) => q.required && !responses[q.id || '']
    );
    if (missingRequired) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await formsService.submitResponse(id, responses);
      setSubmitted(true);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: Question, index: number) => {
    const questionId = question.id || `q-${index}`;

    switch (question.type) {
      case 'text':
        return (
          <Input
            placeholder="Your answer"
            value={responses[questionId] || ''}
            onChange={(e) =>
              setResponses({ ...responses, [questionId]: e.target.value })
            }
            required={question.required}
          />
        );

      case 'email':
        return (
          <Input
            type="email"
            placeholder="your.email@example.com"
            value={responses[questionId] || ''}
            onChange={(e) =>
              setResponses({ ...responses, [questionId]: e.target.value })
            }
            required={question.required}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder="Enter a number"
            value={responses[questionId] || ''}
            onChange={(e) =>
              setResponses({ ...responses, [questionId]: e.target.value })
            }
            required={question.required}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={responses[questionId] || ''}
            onChange={(e) =>
              setResponses({ ...responses, [questionId]: e.target.value })
            }
            required={question.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            rows={4}
            placeholder="Your answer"
            value={responses[questionId] || ''}
            onChange={(e) =>
              setResponses({ ...responses, [questionId]: e.target.value })
            }
            required={question.required}
          />
        );

      case 'select':
        return (
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            value={responses[questionId] || ''}
            onChange={(e) =>
              setResponses({ ...responses, [questionId]: e.target.value })
            }
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.options?.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map((option, i) => (
              <label key={i} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={questionId}
                  value={option}
                  checked={responses[questionId] === option}
                  onChange={(e) =>
                    setResponses({ ...responses, [questionId]: e.target.value })
                  }
                  required={question.required}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option, i) => (
              <label key={i} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={(responses[questionId] || []).includes(option)}
                  onChange={(e) => {
                    const current = responses[questionId] || [];
                    const updated = e.target.checked
                      ? [...current, option]
                      : current.filter((v: string) => v !== option);
                    setResponses({ ...responses, [questionId]: updated });
                  }}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.background }}>
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 rounded-full mx-auto" style={{ borderColor: theme.primary }}></div>
          <p className="mt-4" style={{ color: theme.textSecondary }}>Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.background }}>
        <Card className="text-center">
          <p style={{ color: theme.textSecondary }}>Form not found</p>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: theme.background }}>
        <Card className="max-w-md text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#10b981' }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: theme.textPrimary }}>Thank You!</h2>
          <p style={{ color: theme.textSecondary }}>Your response has been submitted successfully.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: theme.background }}>
      <div className="max-w-3xl mx-auto">
        <div style={{ borderTop: `4px solid ${theme.primary}`, background: theme.cardBg, borderRadius: '0.5rem', marginBottom: '1.5rem', padding: '1.5rem' }}>
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-8 h-8" style={{ color: theme.primary }} />
            <h1 className="text-3xl font-bold" style={{ color: theme.textPrimary }}>{form.title}</h1>
          </div>
          {form.description && (
            <p style={{ color: theme.textSecondary }}>{form.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {visibleQuestions.map((question, index) => (
            <div key={question.id || index} style={{ background: theme.cardBg, borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s' }} className="hover:shadow-lg">
              <div className="space-y-3">
                <label className="block text-lg font-medium" style={{ color: theme.textPrimary }}>
                  {question.label}
                  {question.required && <span className="text-red-600 ml-1">*</span>}
                </label>
                {renderQuestion(question, index)}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full font-semibold py-3 px-4 rounded-lg transition-all hover:opacity-90"
            style={{ background: theme.buttonGradient, color: '#ffffff' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};
