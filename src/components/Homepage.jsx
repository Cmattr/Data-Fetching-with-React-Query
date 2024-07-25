import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Spinner, Alert } from "react-bootstrap";

const fetchProducts = async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    const info = await response.json();
    return info;
};

const Display = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['info'],
        queryFn: fetchProducts,
    });

    if (isLoading) return <Spinner animation="border" role="status"><span className='visually-hidden'>Loading...</span></Spinner>;
    if (isError) return <Alert variant="danger">{error.message}</Alert>;

    
    if (!data || !Array.isArray(data)) {
        return null; 
    }

    return (
        <div>
            {data.map((info) => (
                <Card key={info.id} className="mb-3">
                    <Card.Body>
                        <Card.Title>{info.title}</Card.Title>
                        <Card.Text>{info.body}</Card.Text>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default Display;