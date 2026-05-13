import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Plus, Edit2, Trash2, CheckCircle, XCircle, Calendar, Loader2, 
  Eye, EyeOff, Clock, Palette, Hash, Tag, FileText, AlignLeft, 
  Type, ToggleLeft, ToggleRight, MessageSquare, Sparkles, X 
} from 'lucide-react';
import { api } from '@/services/api';

interface Announcement {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  active: boolean;
  priority: number;
  end_date?: string;
  created_at: string;
  displayDuration?: number;
  backgroundColor?: string;
  textColor?: string;
}

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    active: true,
    priority: 1,
    end_date: '',
    displayDuration: 5,
    backgroundColor: '#3B82F6',
    textColor: '#FFFFFF'
  });

  // Color presets
  const colorPresets = [
    { bg: '#3B82F6', text: '#FFFFFF', name: 'নীল' },
    { bg: '#10B981', text: '#FFFFFF', name: 'সবুজ' },
    { bg: '#F59E0B', text: '#FFFFFF', name: 'কমলা' },
    { bg: '#EF4444', text: '#FFFFFF', name: 'লাল' },
    { bg: '#8B5CF6', text: '#FFFFFF', name: 'বেগুনি' },
    { bg: '#EC4899', text: '#FFFFFF', name: 'গোলাপি' },
    { bg: '#1F2937', text: '#FFFFFF', name: 'গাঢ় স্লেট' },
    { bg: '#F3F4F6', text: '#1F2937', name: 'হালকা ধূসর' },
  ];

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await api.getAnnouncements();
      setAnnouncements(response);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('ঘোষণা লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAnnouncement) {
        await api.updateAnnouncement(editingAnnouncement._id, formData);
        toast.success('ঘোষণা আপডেট হয়েছে');
      } else {
        await api.addAnnouncement(formData);
        toast.success('নতুন ঘোষণা যোগ হয়েছে');
      }
      setIsModalOpen(false);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error('ঘোষণা সংরক্ষণ করতে ব্যর্থ হয়েছে');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('আপনি কি এই ঘোষণাটি মুছে ফেলতে চান?')) {
      try {
        await api.deleteAnnouncement(id);
        toast.success('ঘোষণা মুছে ফেলা হয়েছে');
        fetchAnnouncements();
      } catch (error) {
        console.error('Error deleting announcement:', error);
        toast.error('ঘোষণা মুছতে ব্যর্থ হয়েছে');
      }
    }
  };

  // Toggle active status
  const toggleActive = async (announcement: Announcement) => {
    try {
      await api.updateAnnouncement(announcement._id, { ...announcement, active: !announcement.active });
      toast.success(`ঘোষণা ${!announcement.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে`);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error toggling announcement:', error);
      toast.error('স্ট্যাটাস পরিবর্তন করতে ব্যর্থ হয়েছে');
    }
  };

  const resetForm = () => {
    setEditingAnnouncement(null);
    setFormData({
      title: '',
      message: '',
      type: 'info',
      active: true,
      priority: 1,
      end_date: '',
      displayDuration: 5,
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF'
    });
  };

  const openEditModal = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      active: announcement.active,
      priority: announcement.priority,
      end_date: announcement.end_date || '',
      displayDuration: announcement.displayDuration || 5,
      backgroundColor: announcement.backgroundColor || '#3B82F6',
      textColor: announcement.textColor || '#FFFFFF'
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6 border border-border bg-card rounded-lg">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border bg-card rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-xl">🎉 পপ-আপ বিজ্ঞপ্তি ম্যানেজার</h3>
            <p className="text-sm text-muted-foreground mt-1">সাইট ভিজিটরদের জন্য আকর্ষণীয় পপ-আপ বার্তা তৈরি ও পরিচালনা করুন</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg"
          >
            <Plus size={18} /> নতুন পপ-আপ তৈরি
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-6 py-3 bg-secondary/30 border-b border-border flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>সক্রিয়: {announcements.filter(a => a.active).length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <span>নিষ্ক্রিয়: {announcements.filter(a => !a.active).length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span>মোট: {announcements.length}</span>
        </div>
      </div>

      {/* Announcements List */}
      <div className="p-6">
        {announcements.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-lg">
            <div className="text-6xl mb-4">🎯</div>
            <p className="font-medium">কোনো পপ-আপ নেই</p>
            <p className="text-sm mt-2">নতুন পপ-আপ তৈরি করতে উপরের বাটনে ক্লিক করুন</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {announcements.map((announcement) => (
              <div
                key={announcement._id}
                className={`border rounded-lg overflow-hidden transition-all hover:shadow-md ${announcement.active ? 'bg-white' : 'bg-gray-50 opacity-75'}`}
              >
                {/* Preview Banner */}
                <div 
                  className="p-4 transition-all"
                  style={{ 
                    backgroundColor: announcement.backgroundColor || '#3B82F6',
                    color: announcement.textColor || '#FFFFFF'
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h4 className="font-bold text-lg">{announcement.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${announcement.active ? 'bg-white/20 backdrop-blur' : 'bg-black/20'}`}>
                          {announcement.active ? '🟢 সক্রিয়' : '⚫ নিষ্ক্রিয়'}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 backdrop-blur">
                          ⭐ প্রায়োরিটি: {announcement.priority}
                        </span>
                      </div>
                      <p className="text-sm opacity-95">{announcement.message}</p>
                      <div className="flex items-center gap-4 text-xs mt-3 opacity-80 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {announcement.displayDuration || 5} সেকেন্ড
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(announcement.created_at).toLocaleDateString('bn-BD')}
                        </span>
                        {announcement.end_date && (
                          <span>⏰ মেয়াদ শেষ: {new Date(announcement.end_date).toLocaleDateString('bn-BD')}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(announcement)}
                        className="p-2 rounded-lg bg-white/20 backdrop-blur hover:bg-white/30 transition"
                        title={announcement.active ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                      >
                        {announcement.active ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <button
                        onClick={() => openEditModal(announcement)}
                        className="p-2 rounded-lg bg-white/20 backdrop-blur hover:bg-white/30 transition"
                        title="সম্পাদনা করুন"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement._id)}
                        className="p-2 rounded-lg bg-red-500/20 backdrop-blur hover:bg-red-500/30 transition text-red-100"
                        title="মুছুন"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-border p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-xl">
                    {editingAnnouncement ? '✏️ পপ-আপ সম্পাদনা' : '✨ নতুন পপ-আপ তৈরি'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">দর্শকদের জন্য আকর্ষণীয় বার্তা ডিজাইন করুন</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="px-3 py-1 text-sm rounded-lg bg-secondary hover:bg-secondary/80 transition flex items-center gap-1"
                  >
                    {previewMode ? <Edit2 size={14} /> : <Eye size={14} />}
                    {previewMode ? ' ফর্মে ফিরুন' : ' প্রিভিউ দেখুন'}
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="p-1 rounded-lg hover:bg-secondary transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {previewMode ? (
                // Live Preview
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">পপ-আপ প্রিভিউ</p>
                  </div>
                  <div 
                    className="rounded-xl shadow-xl overflow-hidden transition-all"
                    style={{ backgroundColor: formData.backgroundColor, color: formData.textColor }}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-xl mb-2">{formData.title || 'শিরোনাম'}</h4>
                          <p className="text-sm opacity-95">{formData.message || 'বার্তা লিখুন...'}</p>
                          <div className="flex items-center gap-2 mt-4">
                            <button 
                              className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur text-sm font-medium hover:bg-white/30 transition"
                              style={{ color: formData.textColor }}
                            >
                              বিস্তারিত দেখুন
                            </button>
                            <button 
                              className="px-4 py-2 rounded-lg bg-black/20 backdrop-blur text-sm hover:bg-black/30 transition"
                              style={{ color: formData.textColor }}
                            >
                              বন্ধ করুন
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-2 text-xs opacity-80 bg-black/20">
                      {formData.displayDuration} সেকেন্ড পরে বন্ধ হবে
                    </div>
                  </div>
                </div>
              ) : (
                // Form
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Type size={16} /> শিরোনাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="যেমন: বিশেষ ছাড়ের ঘোষণা"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <MessageSquare size={16} /> বার্তা <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="পপ-আপে দেখানোর বার্তা লিখুন..."
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Hash size={16} /> প্রায়োরিটি (১-১০)
                      </label>
                      <input
                        type="number"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                        min="1"
                        max="10"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <p className="text-xs text-muted-foreground mt-1">১০ = সবচেয়ে গুরুত্বপূর্ণ</p>
                    </div>

                    {/* Display Duration */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Clock size={16} /> প্রদর্শন সময় (সেকেন্ড)
                      </label>
                      <input
                        type="number"
                        value={formData.displayDuration}
                        onChange={(e) => setFormData({ ...formData, displayDuration: parseInt(e.target.value) })}
                        min="2"
                        max="30"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Calendar size={16} /> মেয়াদ শেষ (ঐচ্ছিক)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Color Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Palette size={16} /> রঙ নির্বাচন
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-3">
                      {colorPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ 
                            ...formData, 
                            backgroundColor: preset.bg,
                            textColor: preset.text
                          })}
                          className="w-full aspect-square rounded-lg border-2 transition-all hover:scale-105"
                          style={{ backgroundColor: preset.bg }}
                          title={preset.name}
                        />
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground">পটভূমি রং</label>
                        <input
                          type="color"
                          value={formData.backgroundColor}
                          onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                          className="w-full h-10 rounded border border-border cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground">টেক্সট রং</label>
                        <input
                          type="color"
                          value={formData.textColor}
                          onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                          className="w-full h-10 rounded border border-border cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, active: !formData.active })}
                      className="text-2xl"
                    >
                      {formData.active ? <ToggleRight className="text-green-500 w-8 h-8" /> : <ToggleLeft className="text-gray-400 w-8 h-8" />}
                    </button>
                    <div>
                      <p className="font-medium">সক্রিয় অবস্থা</p>
                      <p className="text-xs text-muted-foreground">
                        {formData.active ? 'পপ-আপ সাইটে দেখানো হবে' : 'পপ-আপ নিষ্ক্রিয় আছে'}
                      </p>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex-1 hover:bg-primary/90 transition">
                      {editingAnnouncement ? 'আপডেট করুন' : 'পপ-আপ তৈরি করুন'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        resetForm();
                      }}
                      className="border border-border px-4 py-2 rounded-lg flex-1 hover:bg-secondary transition"
                    >
                      বাতিল করুন
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementManager;