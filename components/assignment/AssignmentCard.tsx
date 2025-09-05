'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Clock, CheckCircle } from 'lucide-react';
import { Assignment } from '@/lib/types';

interface AssignmentCardProps {
  assignment: Assignment;
  submissionStatus?: 'not_submitted' | 'submitted' | 'graded' | 'draft';
  isOverdue?: boolean;
  onViewDetails?: () => void;
  onSubmit?: () => void;
  onGrade?: () => void;
  showActions?: boolean;
}

export default function AssignmentCard({ 
  assignment, 
  submissionStatus = 'not_submitted',
  isOverdue = false,
  onViewDetails,
  onSubmit,
  onGrade,
  showActions = true
}: AssignmentCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'graded':
        return <Badge variant="default" className="bg-green-500">Graded</Badge>;
      case 'submitted':
        return <Badge variant="secondary">Submitted</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="destructive">Not Submitted</Badge>;
    }
  };

  const getTotalMarks = () => {
    return assignment.questions.reduce((total, question) => total + question.maxMarks, 0);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{assignment.title}</CardTitle>
            <div className="flex items-center space-x-2 mb-2">
              {getStatusBadge(submissionStatus)}
              {isOverdue && submissionStatus !== 'submitted' && submissionStatus !== 'graded' && (
                <Badge variant="destructive">Overdue</Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Assignment Description */}
        <p className="text-sm text-muted-foreground">{assignment.description}</p>
        
        {/* Assignment Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {assignment.questions.length} questions
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Total: {getTotalMarks()} marks
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Created: {new Date(assignment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Questions Preview */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Questions:</h4>
          <div className="space-y-1">
            {assignment.questions.slice(0, 3).map((question, index) => (
              <div key={question.id} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground truncate flex-1 mr-2">
                  {index + 1}. {question.text}
                </span>
                <span className="text-muted-foreground font-medium">
                  {question.maxMarks} marks
                </span>
              </div>
            ))}
            {assignment.questions.length > 3 && (
              <p className="text-xs text-muted-foreground">
                +{assignment.questions.length - 3} more questions...
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex space-x-2 pt-2">
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              View Details
            </Button>
            
            {submissionStatus === 'not_submitted' && (
              <Button size="sm" onClick={onSubmit}>
                Submit Assignment
              </Button>
            )}
            
            {submissionStatus === 'submitted' && onGrade && (
              <Button size="sm" onClick={onGrade}>
                Grade Submission
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
