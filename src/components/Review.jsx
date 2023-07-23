import { Rating } from '@mui/material'
import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Form } from 'react-bootstrap';
import { deleteReview, editReview } from '../api/internal/postgres';

export default function Review({ review, triggerRerender }) {
  const { user } = useAuthContext();
  const [comment, setComment] = useState(review.comment);
  const [score, setScore] = useState(review.score);
  const [isEditable, setIsEditable] = useState(false);

  const handleClickEdit = () => {
    setIsEditable(true);
  }

  const handleClickDelete = async () => {
    await deleteReview(review.id);
    triggerRerender();
  }

  const handleClickClose = () => {
    setScore(review.score);
    setComment(review.comment);
    setIsEditable(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editReview(review.id, comment, score);
    setIsEditable(false);
    triggerRerender();
  }

  if (isEditable) {
    return (
      <form 
        onSubmit={(e) => handleSubmit(e)} 
        className='border-t first:border-none py-2'
      >
        <div className='flex justify-between items-center'>
          <b>{review.username}</b>
          <div className='space-x-1'>
            <button type="button">
              <CloseIcon onClick={handleClickClose} />
            </button>
          </div>
        </div>
        <Rating 
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
        <Form.Control 
          as="textarea"
          rows={3}
          value={comment}
          onChange={(e) => {setComment(e.target.value);}}
          required
        />
        <Form.Group className='my-3 space-x-2'>
          <Button type="submit" variant="primary">Confirm</Button>
          <Button type="button" variant="secondary" onClick={handleClickClose}>Cancel</Button>
        </Form.Group>
      </form>
    )
  }

  return (
    <div className='border-t first:border-none py-2'>
      <div className='flex justify-between items-center'>
        <b>{review.username}</b>
        <div className='space-x-1'>
          { review.username == user.username &&
            <>
              <button type='button'>
                <EditIcon onClick={handleClickEdit}/>
              </button>
              <button type='button' onClick={handleClickDelete}>
                <DeleteIcon />
              </button>
            </>
          }
          <span>{(new Date(review.date)).toLocaleDateString()}</span>
        </div>
      </div>
      <Rating 
        readOnly
        value={review.score}
      />
      <p className='m-0'>{review.comment}</p>
    </div>
  )

  
}
