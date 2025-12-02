'use client';

import { useState, useEffect } from 'react';
import { DocumentComment } from '../types';
import { documentService } from '../services/document.service';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, Trash2, Edit2, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface DocumentCommentsProps {
    documentId: number;
    canComment: boolean;
}

export function DocumentComments({ documentId, canComment }: DocumentCommentsProps) {
    const [comments, setComments] = useState<DocumentComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        fetchComments();
    }, [documentId]);

    const fetchComments = async () => {
        setIsLoading(true);
        try {
            const data = await documentService.getComments(documentId);
            setComments(data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
            toast.error('Failed to load comments');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        setIsSubmitting(true);
        try {
            const comment = await documentService.addComment({
                document_id: documentId,
                comment: newComment,
            });
            setComments([comment, ...comments]);
            setNewComment('');
            toast.success('Comment added successfully');
        } catch (error) {
            console.error('Failed to add comment:', error);
            toast.error('Failed to add comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditComment = async (commentId: number) => {
        if (!editText.trim()) {
            toast.error('Comment cannot be empty');
            return;
        }

        try {
            const updated = await documentService.updateComment(commentId, editText);
            setComments(comments.map(c => c.id === commentId ? updated : c));
            setEditingId(null);
            setEditText('');
            toast.success('Comment updated successfully');
        } catch (error) {
            console.error('Failed to update comment:', error);
            toast.error('Failed to update comment');
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            await documentService.deleteComment(commentId);
            setComments(comments.filter(c => c.id !== commentId));
            toast.success('Comment deleted successfully');
        } catch (error) {
            console.error('Failed to delete comment:', error);
            toast.error('Failed to delete comment');
        }
    };

    const startEdit = (comment: DocumentComment) => {
        setEditingId(comment.id);
        setEditText(comment.comment);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-medium">Comments</h4>

            {/* Add Comment Form */}
            {canComment && (
                <div className="space-y-2">
                    <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        className="resize-none"
                    />
                    <div className="flex justify-end">
                        <Button
                            size="sm"
                            onClick={handleAddComment}
                            disabled={isSubmitting || !newComment.trim()}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4 mr-2" />
                            )}
                            Post Comment
                        </Button>
                    </div>
                </div>
            )}

            {/* Comments List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            ) : comments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                    No comments yet. {canComment && 'Be the first to comment!'}
                </p>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage src={comment.user.avatar} />
                                <AvatarFallback>
                                    {comment.user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{comment.user.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {format(new Date(comment.created_at), 'MMM d, yyyy HH:mm')}
                                    </span>
                                </div>

                                {editingId === comment.id ? (
                                    <div className="space-y-2">
                                        <Textarea
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            rows={3}
                                            className="resize-none"
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleEditComment(comment.id)}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={cancelEdit}
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-foreground whitespace-pre-wrap">
                                            {comment.comment}
                                        </p>
                                        <div className="flex gap-2 pt-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-7 text-xs"
                                                onClick={() => startEdit(comment)}
                                            >
                                                <Edit2 className="w-3 h-3 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-7 text-xs text-destructive hover:text-destructive"
                                                onClick={() => handleDeleteComment(comment.id)}
                                            >
                                                <Trash2 className="w-3 h-3 mr-1" />
                                                Delete
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
