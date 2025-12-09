import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { ColorThemeSelector } from "../components/ColorThemeSelector";
import { RoutingRuleEditor } from "../components/RoutingRuleEditor";
import { formsService } from "../services/forms.service";
import type { Question, ColorTheme } from "../types";
import {
  Plus,
  Trash2,
  GripVertical,
  Type,
  Mail,
  Hash,
  AlignLeft,
  ChevronDown,
  Circle,
  CheckSquare,
  Calendar,
  Sparkles,
} from "lucide-react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

// ------------------ ICON HANDLER ------------------
const getQuestionIcon = (type: Question["type"]) => {
  const iconClass = "w-5 h-5";
  switch (type) {
    case "text":
      return <Type className={iconClass} />;
    case "email":
      return <Mail className={iconClass} />;
    case "number":
      return <Hash className={iconClass} />;
    case "textarea":
      return <AlignLeft className={iconClass} />;
    case "select":
      return <ChevronDown className={iconClass} />;
    case "radio":
      return <Circle className={iconClass} />;
    case "checkbox":
      return <CheckSquare className={iconClass} />;
    case "date":
      return <Calendar className={iconClass} />;
    default:
      return <Type className={iconClass} />;
  }
};

// ------------------ SORTABLE QUESTION ITEM ------------------

interface SortableQuestionProps {
  question: Question;
  index: number;
  allQuestions: Question[];
  updateQuestion: (index: number, field: keyof Question, value: any) => void;
  removeQuestion: (index: number) => void;
}

const SortableQuestion: React.FC<SortableQuestionProps> = ({
  question,
  index,
  allQuestions,
  updateQuestion,
  removeQuestion,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: question.id as string });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group">
      <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500 bg-gradient-to-r from-white to-purple-50/30">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-2 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
              </div>

              <div className="flex items-center space-x-2 bg-purple-100 px-3 py-1.5 rounded-full">
                {getQuestionIcon(question.type)}
                <span className="text-sm font-semibold text-purple-700">
                  Question {index + 1}
                </span>
              </div>
            </div>

            <Button
              size="sm"
              variant="danger"
              onClick={() => removeQuestion(index)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Label */}
          <Input
            placeholder="Enter your question"
            value={question.label}
            onChange={(e) => updateQuestion(index, "label", e.target.value)}
            className="text-lg font-medium"
          />

          {/* Type + Required */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Question Type
              </label>
              <select
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white transition-all"
                value={question.type}
                onChange={(e) =>
                  updateQuestion(index, "type", e.target.value as Question["type"])
                }
              >
                <option value="text">📝 Text</option>
                <option value="email">📧 Email</option>
                <option value="number">🔢 Number</option>
                <option value="textarea">📄 Textarea</option>
                <option value="select">📋 Select</option>
                <option value="radio">⭕ Radio</option>
                <option value="checkbox">☑️ Checkbox</option>
                <option value="date">📅 Date</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center space-x-2 px-4 py-2.5 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
                <input
                  type="checkbox"
                  checked={question.required}
                  onChange={(e) =>
                    updateQuestion(index, "required", e.target.checked)
                  }
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Required
                </span>
              </label>
            </div>
          </div>

          {/* OPTIONS FOR SELECT/RADIO/CHECKBOX */}
          {(question.type === "select" ||
            question.type === "radio" ||
            question.type === "checkbox") && (
            <div className="bg-purple-50/50 p-4 rounded-lg border-2 border-purple-100">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Options (comma-separated)
              </label>
              <Input
                placeholder="Option 1, Option 2, Option 3"
                value={question.options?.join(", ") || ""}
                onChange={(e) =>
                  updateQuestion(
                    index,
                    "options",
                    e.target.value.split(",").map((o) => o.trim())
                  )
                }
              />
            </div>
          )}

          {/* ROUTING RULE EDITOR */}
          <RoutingRuleEditor
            currentQuestion={question}
            allQuestions={allQuestions}
            currentIndex={index}
            onRuleChange={(rule) => updateQuestion(index, "routingRule", rule)}
          />
        </div>
      </Card>
    </div>
  );
};

// ------------------ MAIN FORM BUILDER ------------------

export const FormBuilder: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [colorTheme, setColorTheme] = useState<ColorTheme>("purple");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ------------------ LOAD FORM ------------------
  useEffect(() => {
    if (id) loadForm();
  }, [id]);

  const loadForm = async () => {
    setIsLoading(true);
    try {
      const form = await formsService.getForm(id!);

      setTitle(form.form.title);
      setDescription(form.form.description);
      setColorTheme(form.form.colorTheme || "purple");

      // Ensure every loaded question has an ID
      setQuestions(
        form.form.fields.map((q: any) => ({
          ...q,
          id: q.id || crypto.randomUUID(),
        }))
      );
    } catch (error) {
      console.error("Failed to load form:", error);
    }
    setIsLoading(false);
  };

  // ------------------ ADD QUESTION ------------------
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID(),
        type: "text",
        label: "",
        required: false,
        options: [],
      },
    ]);
  };

  // ------------------ UPDATE QUESTION ------------------
  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  // ------------------ REMOVE QUESTION ------------------
  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // ------------------ DRAG & DROP ------------------
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    setQuestions((items) => {
      const oldIndex = items.findIndex((q) => q.id === active.id);
      const newIndex = items.findIndex((q) => q.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  // ------------------ SAVE FORM ------------------
  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a form title");
      return;
    }

    setIsSaving(true);

    try {
      // Prepare questions for backend
      const preparedQuestions = questions.map(q => ({
        ...q,
        id: q.id || crypto.randomUUID() // Ensure all have id
      }));

      if (id) {
        await formsService.updateForm(id, {
          title,
          description,
          fields: preparedQuestions,
          colorTheme,
        });
      } else {
        await formsService.createForm({
          title,
          description,
          fields: preparedQuestions,
          colorTheme,
        });
      }

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Save error:", error);
      alert(error.response?.data?.message || "Failed to save form");
    }

    setIsSaving(false);
  };

  // ------------------ RENDER ------------------

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-20">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-b-2 border-purple-600 rounded-full mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading form...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-10 h-10" />
              <h1 className="text-4xl font-bold">
                {id ? "✏️ Edit Form" : "✨ Create New Form"}
              </h1>
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => navigate("/dashboard")}
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
              >
                {isSaving ? "Saving..." : "Save Form"}
              </Button>
            </div>
          </div>
        </div>

        {/* FORM DETAILS */}
        <Card className="shadow-lg border-2 border-purple-100 p-6 bg-gradient-to-br from-white to-purple-50/20">
          <div className="space-y-5">
            <div>
              <label className="font-bold text-gray-800 flex items-center space-x-2">
                <span>Form Title</span>
                <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g., Customer Feedback Survey"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-semibold mt-2"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800">Description</label>
              <textarea
                rows={3}
                className="w-full border-2 border-gray-200 p-3 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Describe the purpose of this form..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* COLOR THEME SELECTOR */}
            <ColorThemeSelector
              selectedTheme={colorTheme}
              onThemeChange={setColorTheme}
            />
          </div>
        </Card>

        {/* QUESTIONS LIST */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center space-x-2">
            <span>Questions</span>
            <span className="text-purple-600">({questions.length})</span>
          </h2>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={questions.map((q) => q.id as string)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <SortableQuestion
                    key={q.id}
                    question={q}
                    index={index}
                    allQuestions={questions}
                    updateQuestion={updateQuestion}
                    removeQuestion={removeQuestion}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {questions.length === 0 && (
            <div className="text-center py-12 bg-purple-50/30 rounded-lg border-2 border-dashed border-purple-200">
              <p className="text-gray-500 text-lg">No questions yet — click below to add one.</p>
            </div>
          )}
        </div>

        {/* ADD QUESTION */}
        <Button
          onClick={addQuestion}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Question
        </Button>
      </div>
    </MainLayout>
  );
};
