import React, { useState } from 'react';
import { HiStar } from 'react-icons/hi';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const FeedbackForm = ({ chatId }) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/feedback', { chat: chatId, rating, comment });
      toast.success('Thank you for your feedback!');
      setComment('');
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 mt-8 transition-colors">
      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Rate this AI explanation</h4>
      
      <div className="flex items-center gap-1 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`transition-all duration-200 transform ${
              (hover || rating) >= star ? 'text-accent scale-110' : 'text-slate-300 dark:text-slate-600'
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <HiStar size={32} />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="How can we improve these explanations? (Optional)"
        className="input-field min-h-[100px] text-sm mb-4"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full md:w-auto"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
};

export default FeedbackForm;
