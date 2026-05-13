import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Star, Trash2, User, Loader2 } from 'lucide-react';
import { api } from '@/services/api';

interface Testimonial {
  _id: string;
  name: string;
  email?: string;
  rating: number;
  comment: string;
  approved: boolean;
  created_at: string;
}

const TestimonialManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  // Fetch testimonials
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await api.getTestimonials();
      setTestimonials(response);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('প্রশংসাপত্র লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Toggle approval status
  const toggleApproval = async (testimonial: Testimonial) => {
    try {
      await api.updateTestimonial(testimonial._id, { ...testimonial, approved: !testimonial.approved });
      toast.success(`প্রশংসাপত্র ${!testimonial.approved ? 'অনুমোদিত' : 'অনুমোদন বাতিল'} করা হয়েছে`);
      fetchTestimonials();
    } catch (error) {
      console.error('Error toggling testimonial:', error);
      toast.error('স্ট্যাটাস পরিবর্তন করতে ব্যর্থ হয়েছে');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('আপনি কি এই প্রশংসাপত্রটি মুছে ফেলতে চান?')) {
      try {
        await api.deleteTestimonial(id);
        toast.success('প্রশংসাপত্র মুছে ফেলা হয়েছে');
        fetchTestimonials();
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        toast.error('প্রশংসাপত্র মুছতে ব্যর্থ হয়েছে');
      }
    }
  };

  const getFilteredTestimonials = () => {
    if (filter === 'approved') return testimonials.filter(t => t.approved);
    if (filter === 'pending') return testimonials.filter(t => !t.approved);
    return testimonials;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="p-6 border border-border bg-card">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const filteredTestimonials = getFilteredTestimonials();

  return (
    <div className="border border-border bg-card">
      <div className="p-6 border-b border-border">
        <div>
          <h3 className="font-semibold text-lg">প্রশংসাপত্র ম্যানেজার</h3>
          <p className="text-sm text-muted-foreground">গ্রাহকের প্রশংসাপত্র পরিচালনা করুন</p>
        </div>
        
        {/* Filter tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded transition ${filter === 'all' ? 'bg-primary text-white' : 'bg-secondary hover:bg-secondary/80'}`}
          >
            সব ({testimonials.length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1 text-sm rounded transition ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-secondary hover:bg-secondary/80'}`}
          >
            অনুমোদিত ({testimonials.filter(t => t.approved).length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 text-sm rounded transition ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-secondary hover:bg-secondary/80'}`}
          >
            pending ({testimonials.filter(t => !t.approved).length})
          </button>
        </div>
      </div>

      <div className="p-6">
        {filteredTestimonials.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>কোনো প্রশংসাপত্র নেই</p>
            {filter !== 'all' && (
              <p className="text-sm mt-2">ফিল্টার পরিবর্তন করে দেখুন</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTestimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className={`border rounded-lg p-4 transition-all ${testimonial.approved ? 'bg-white' : 'bg-yellow-50'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <div className="flex items-center gap-1">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 italic">
                      "{testimonial.comment}"
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {new Date(testimonial.created_at).toLocaleDateString('bn-BD')}
                      </span>
                      {testimonial.email && (
                        <span>{testimonial.email}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleApproval(testimonial)}
                      className={`p-2 rounded transition ${
                        testimonial.approved 
                          ? 'hover:bg-yellow-100 text-yellow-600' 
                          : 'hover:bg-green-100 text-green-600'
                      }`}
                      title={testimonial.approved ? 'অনুমোদন বাতিল করুন' : 'অনুমোদন করুন'}
                    >
                      {testimonial.approved ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
                      className="p-2 hover:bg-red-100 rounded transition text-red-600"
                      title="মুছুন"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialManager;