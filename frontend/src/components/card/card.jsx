import React from 'react';
import Card from 'react-bootstrap/Card';

const HighlightCard = ({ image, title, text }) => {
  return (
    <Card style={{ width: '25rem' }} className="mx-2">
      <Card.Img variant="top" src={image} alt={title} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{text}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default HighlightCard;