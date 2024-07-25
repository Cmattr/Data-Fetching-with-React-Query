import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Col, Form } from "react-bootstrap";

const CrudOperations = () => {
    const queryClient = useQueryClient();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const mutateAddPost = useMutation({
        mutationFn: async (newPost) => {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify(newPost),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to add post');
            }
            return response.json();
        },
        onSuccess: (data) => {
            setShowSuccessAlert(true);
            console.log('Post added with ID:', data.id);
            queryClient.invalidateQueries(['posts']); 
            setTimeout(() => setShowSuccessAlert(false), 5000);
        },
        onError: (error) => {
            console.error('Error adding post:', error);
        },
    });

    const mutateUpdatePost = useMutation({
        mutationFn: async ({ id, title, body }) => {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ id, title, body }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to update post');
            }
            return response.json();
        },
        onSuccess: (data) => {
            setShowSuccessAlert(true);
            console.log('Post updated with ID:', data.id);
            queryClient.invalidateQueries(['posts']); 
            setTimeout(() => setShowSuccessAlert(false), 5000);
        },
        onError: (error) => {
            console.error('Error updating post:', error);
        },
    });

    const mutateDeletePost = useMutation({
        mutationFn: async (postId) => {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete post');
            }
            return postId; 
        },
        onSuccess: (deletedPostId) => {
            setShowSuccessAlert(true);
            console.log('Post deleted with ID:', deletedPostId);
            queryClient.invalidateQueries(['posts']); 
            
            setTimeout(() => setShowSuccessAlert(false), 5000);
        },
        onError: (error) => {
            console.error('Error deleting post:', error);
        },
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const actionType = formData.get('actionType');

        if (actionType === 'add') {
            const newPost = {
                title: formData.get('title'),
                body: formData.get('body'),
                userId: parseInt(formData.get('userId')),
            };
            mutateAddPost.mutate(newPost);
        } else if (actionType === 'update') {
            const updatedPost = {
                id: parseInt(formData.get('postId')),
                title: formData.get('title'),
                body: formData.get('body'),
            };
            mutateUpdatePost.mutate(updatedPost);
        } else if (actionType === 'delete') {
            const postIdToDelete = parseInt(formData.get('postId'));
            mutateDeletePost.mutate(postIdToDelete);
        }

        event.target.reset();
    };

    return (
        <div>
            {mutateAddPost.isError && <Alert variant="danger">An Error has occurred: {mutateAddPost.error.message}</Alert>}
            {mutateUpdatePost.isError && <Alert variant="danger">An Error has occurred: {mutateUpdatePost.error.message}</Alert>}
            {mutateDeletePost.isError && <Alert variant="danger">An Error has occurred: {mutateDeletePost.error.message}</Alert>}
            {showSuccessAlert && <Alert variant="success">Action completed successfully!</Alert>}
            <Col md={{ span: 6, offset: 3 }}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="actionType">
                        <Form.Label>Action Type</Form.Label>
                        <Form.Control as="select" name="actionType" required>
                            <option value="add">Add</option>
                            <option value="update">Update</option>
                            <option value="delete">Delete</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter title" name="title" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label>Body</Form.Label>
                        <Form.Control name="body" as="textarea" rows={3} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="userId">
                        <Form.Label>User ID</Form.Label>
                        <Form.Control type="number" placeholder="Enter user ID" name="userId" min="1" required />
                    </Form.Group>
                    {mutateAddPost.isLoading || mutateUpdatePost.isLoading || mutateDeletePost.isLoading ? (
                        <Button variant="primary" disabled>
                            Loading...
                        </Button>
                    ) : (
                        <Button variant="primary" type="submit">
                            Perform Action
                        </Button>
                    )}
                </Form>
            </Col>
        </div>
    );
};

export default CrudOperations;