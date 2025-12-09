import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Card } from '../components/Card';
import { formsService } from '../services/forms.service';
import type { FormResponse } from '../types';
import { MessageSquare, Clock, User, ClipboardList } from 'lucide-react';

export const FormResponses: React.FC = () => {
  const { id } = useParams();
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResponses();
  }, [id]);

  const loadResponses = async () => {
    if (!id) return;
    try {
      const data = await formsService.getFormResponses(id);
      setResponses(data.responses);
    } catch (error) {
      console.error('Failed to load responses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <ClipboardList className="w-10 h-10 text-blue-600" />
              Form Responses
            </h1>
            <p className="text-gray-500 mt-1">
              View all submitted responses for this form
            </p>
          </div>

          {/* Count Badge */}
          <div className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md font-semibold">
            {responses.length} Responses
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
          </div>
        ) : responses.length === 0 ? (
          <Card className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 border-blue-200">
            <MessageSquare className="w-12 h-12 mx-auto text-blue-500 mb-3" />
            <p className="text-gray-700 text-lg font-medium">No responses yet.</p>
            <p className="text-gray-500">Share your form to collect responses.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {responses.map((response, index) => (
              <Card
                key={response._id}
                className="p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200"
              >
                {/* Response Header */}
                <div className="flex justify-between items-center pb-4 border-b">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Response #{index + 1}
                  </h3>
                  <span className="text-sm flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                    <Clock className="w-4 h-4" />
                    {new Date(response.submittedAt).toLocaleString()}
                  </span>
                </div>

                {/* Response Body */}
                <div className="mt-4 space-y-4">
                  {Object.entries(response.responses).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-all"
                    >
                      <p className="text-sm font-semibold text-gray-700">
                        Question {key}
                      </p>
                      <p className="text-gray-900 text-lg font-medium mt-1">
                        {Array.isArray(value) ? value.join(', ') : value}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
