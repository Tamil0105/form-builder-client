import React, { useState } from 'react';
import type { Question, RoutingRule } from '../types';
import { GitBranch, X } from 'lucide-react';
import { Button } from './Button';

interface RoutingRuleEditorProps {
  currentQuestion: Question;
  allQuestions: Question[];
  currentIndex: number;
  onRuleChange: (rule: RoutingRule | undefined) => void;
}

export const RoutingRuleEditor: React.FC<RoutingRuleEditorProps> = ({
  currentQuestion,
  allQuestions,
  currentIndex,
  onRuleChange,
}) => {
  const [isEditing, setIsEditing] = useState(!!currentQuestion.routingRule);

  // Only show questions that come before this one
  const previousQuestions = allQuestions.slice(0, currentIndex);

  const handleAddRule = () => {
    setIsEditing(true);
    if (!currentQuestion.routingRule && previousQuestions.length > 0) {
      onRuleChange({
        sourceQuestionId: previousQuestions[0].id || '',
        condition: 'equals',
        value: '',
      });
    }
  };

  const handleRemoveRule = () => {
    setIsEditing(false);
    onRuleChange(undefined);
  };

  const handleRuleUpdate = (field: keyof RoutingRule, value: string) => {
    if (currentQuestion.routingRule) {
      onRuleChange({
        ...currentQuestion.routingRule,
        [field]: value,
      });
    }
  };

  // If no previous questions, can't add routing
  if (previousQuestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-indigo-50/50 p-4 rounded-lg border-2 border-indigo-100">
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
          <GitBranch className="w-4 h-4 text-indigo-600" />
          <span>Conditional Display (Routing)</span>
        </label>
        
        {!isEditing ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleAddRule}
            className="text-xs"
          >
            Add Rule
          </Button>
        ) : (
          <button
            type="button"
            onClick={handleRemoveRule}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isEditing && currentQuestion.routingRule && (
        <div className="space-y-3">
          <div className="text-xs text-gray-600 mb-2">
            Show this question only when:
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Source Question */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Question
              </label>
              <select
                className="w-full px-2 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={currentQuestion.routingRule.sourceQuestionId}
                onChange={(e) => handleRuleUpdate('sourceQuestionId', e.target.value)}
              >
                {previousQuestions.map((q, idx) => (
                  <option key={q.id} value={q.id}>
                    Q{idx + 1}: {q.label.substring(0, 20)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Condition
              </label>
              <select
                className="w-full px-2 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={currentQuestion.routingRule.condition}
                onChange={(e) =>
                  handleRuleUpdate('condition', e.target.value as RoutingRule['condition'])
                }
              >
                <option value="equals">Equals</option>
                <option value="notEquals">Not Equals</option>
                <option value="contains">Contains</option>
              </select>
            </div>

            {/* Value */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Value
              </label>
              <input
                type="text"
                className="w-full px-2 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Answer value"
                value={currentQuestion.routingRule.value}
                onChange={(e) => handleRuleUpdate('value', e.target.value)}
              />
            </div>
          </div>

          <div className="text-xs text-indigo-600 bg-indigo-50 p-2 rounded border border-indigo-200">
            💡 This question will only appear when the selected question's answer matches the condition
          </div>
        </div>
      )}
    </div>
  );
};
