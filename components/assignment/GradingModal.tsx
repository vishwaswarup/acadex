'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Download } from 'lucide-react';
import { Assignment, Submission, QuestionMark } from '@/lib/types';

interface GradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment;
  submission: Submission;
  onGradeSubmit: (marks: QuestionMark[], feedback: string) => void;
  loading?: boolean;
}

export default function GradingModal({
  isOpen,
  onClose,
  assignment,
  submission,
  onGradeSubmit,
  loading = false
}: GradingModalProps) {
  const [marks, setMarks] = useState<QuestionMark[]>([]);
  const [feedback, setFeedback] = useState('');
  const [totalMarks, setTotalMarks] = useState(0);

  // Initialize marks when assignment changes
  useEffect(() => {
    if (assignment && assignment.questions) {
      const initialMarks: QuestionMark[] = assignment.questions.map(question => ({
        questionId: question.id,
        mark: 0
      }));
      setMarks(initialMarks);
    }
  }, [assignment]);

  // Calculate total marks when marks change
  useEffect(() => {
    const total = marks.reduce((sum, mark) => sum + mark.mark, 0);
    setTotalMarks(total);
  }, [marks]);

  const updateMark = (questionId: string, value: string) => {
    const markValue = Math.max(0, parseFloat(value) || 0);
    setMarks(prev => prev.map(mark => 
      mark.questionId === questionId 
        ? { ...mark, mark: markValue }
        : mark
    ));
  };

  const getMaxMarks = (questionId: string) => {
    const question = assignment.questions.find(q => q.id === questionId);
    return question?.maxMarks || 0;
  };

  const handleSubmit = () => {
    // Validate marks
    const invalidMarks = marks.some(mark => {
      const maxMarks = getMaxMarks(mark.questionId);
      return mark.mark > maxMarks || mark.mark < 0;
    });

    if (invalidMarks) {
      alert('Please ensure all marks are within the valid range');
      return;
    }

    onGradeSubmit(marks, feedback);
  };

  const downloadFile = (file: { url: string; name: string }) => {
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Grade Submission</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Assignment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{assignment.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>
              <div className="flex items-center space-x-4 text-sm">
                <Badge variant="outline">
                  {assignment.questions.length} questions
                </Badge>
                <Badge variant="outline">
                  Total: {assignment.questions.reduce((sum, q) => sum + q.maxMarks, 0)} marks
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Submission Files */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Submitted Files</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {submission.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFile(file)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Grading Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Grading</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignment.questions.map((question, index) => (
                <div key={question.id} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <Label htmlFor={`mark-${question.id}`} className="text-sm font-medium">
                      Question {index + 1}: {question.text}
                    </Label>
                    <Badge variant="outline">
                      Max: {question.maxMarks} marks
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      id={`mark-${question.id}`}
                      type="number"
                      min="0"
                      max={question.maxMarks}
                      step="0.5"
                      value={marks.find(m => m.questionId === question.id)?.mark || 0}
                      onChange={(e) => updateMark(question.id, e.target.value)}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">
                      / {question.maxMarks}
                    </span>
                  </div>
                </div>
              ))}

              {/* Total Marks Display */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Marks:</span>
                  <span className="text-lg font-bold text-primary">
                    {totalMarks} / {assignment.questions.reduce((sum, q) => sum + q.maxMarks, 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add feedback for the student..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Grade'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
