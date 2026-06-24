const API_BASE_URL = import.meta.env.VITE_API_URL || "https://cattle-x-back-end.vercel.app";

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        // Session expired - redirect to login
        window.location.href = "/login";
        throw new Error("Session expired");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────────────
  //  IMAGE UPLOAD ENDPOINTS (নতুন যোগ করা হলো)
  // ─────────────────────────────────────────────────────────────────────

  /**
   * Single image upload to Cloudinary
   * @param file - Image file to upload
   * @returns Object containing image URL and public_id
   */
  async uploadImage(file: File): Promise<{ url: string; public_id: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${this.baseUrl}/api/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Image upload failed');
    }
    
    const data = await response.json();
    return { url: data.url, public_id: data.public_id };
  }

  /**
   * Multiple images upload to Cloudinary
   * @param files - Array of image files to upload
   * @returns Object containing array of URLs and public_ids
   */
  async uploadMultipleImages(files: File[]): Promise<{ urls: string[]; public_ids: string[] }> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    const response = await fetch(`${this.baseUrl}/api/upload/multiple`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Image upload failed');
    }
    
    const data = await response.json();
    return { urls: data.urls, public_ids: data.public_ids };
  }

  /**
   * Delete image from Cloudinary
   * @param public_id - Cloudinary public_id of the image to delete
   */
  async deleteImage(public_id: string): Promise<void> {
    await this.request(`/api/upload/${public_id}`, {
      method: 'DELETE',
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  //  AUTH ENDPOINTS
  // ─────────────────────────────────────────────────────────────────────

  async register(userData: { name: string; email: string; password: string }) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async googleLogin(accessToken: string) {
    return this.request("/auth/google", {
      method: "POST",
      body: JSON.stringify({ accessToken }),
    });
  }

  async refreshSession() {
    return this.request("/auth/refresh", { method: "POST" });
  }

  async logout() {
    return this.request("/auth/logout", { method: "POST" });
  }

  async getCurrentUser() {
    return this.request("/auth/me");
  }

  // ─────────────────────────────────────────────────────────────────────
  //  USER ENDPOINTS (admin only)
  // ─────────────────────────────────────────────────────────────────────

  async getAllUsers() {
    return this.request("/api/users");
  }

  async addUserRole(userId: string, role: string) {
    return this.request(`/api/users/${userId}/roles`, {
      method: "POST",
      body: JSON.stringify({ role }),
    });
  }

  async removeUserRole(userId: string, role: string) {
    return this.request(`/api/users/${userId}/roles/${role}`, {
      method: "DELETE",
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  //  COWS ENDPOINTS
  // ─────────────────────────────────────────────────────────────────────

  async getCows() {
    return this.request("/api/cows");
  }

  async getCow(id: string) {
    return this.request(`/api/cows/${id}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async addCow(cowData: any) {
    return this.request("/api/cows", {
      method: "POST",
      body: JSON.stringify(cowData),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateCow(id: string, cowData: any) {
    return this.request(`/api/cows/${id}`, {
      method: "PUT",
      body: JSON.stringify(cowData),
    });
  }

  async deleteCow(id: string) {
    return this.request(`/api/cows/${id}`, {
      method: "DELETE",
    });
  }

  async toggleFeatured(id: string, featured: boolean) {
    return this.request(`/api/cows/${id}/featured`, {
      method: "PATCH",
      body: JSON.stringify({ featured }),
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  //  PRICE INDEX ENDPOINTS
  // ─────────────────────────────────────────────────────────────────────

  async getPriceIndex() {
    return this.request("/api/price-index");
  }

  async addPrice(priceData: { price: number; change_percent: number; mode: string }) {
    return this.request("/api/price-index", {
      method: "POST",
      body: JSON.stringify(priceData),
    });
  }

  async getSmartPrice() {
    return this.request("/api/smart-price", {
      method: "POST",
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  //  ANNOUNCEMENTS ENDPOINTS
  // ─────────────────────────────────────────────────────────────────────

  async getAnnouncements() {
    return this.request("/api/announcements");
  }

  async getActiveAnnouncements() {
    return this.request("/api/announcements/active");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async addAnnouncement(announcementData: any) {
    return this.request("/api/announcements", {
      method: "POST",
      body: JSON.stringify(announcementData),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateAnnouncement(id: string, announcementData: any) {
    return this.request(`/api/announcements/${id}`, {
      method: "PUT",
      body: JSON.stringify(announcementData),
    });
  }

  async deleteAnnouncement(id: string) {
    return this.request(`/api/announcements/${id}`, {
      method: "DELETE",
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  //  TESTIMONIALS ENDPOINTS
  // ─────────────────────────────────────────────────────────────────────

  async getTestimonials() {
    return this.request("/api/testimonials");
  }

  async getApprovedTestimonials() {
    return this.request("/api/testimonials/approved");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async addTestimonial(testimonialData: any) {
    return this.request("/api/testimonials", {
      method: "POST",
      body: JSON.stringify(testimonialData),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateTestimonial(id: string, testimonialData: any) {
    return this.request(`/api/testimonials/${id}`, {
      method: "PUT",
      body: JSON.stringify(testimonialData),
    });
  }

  async deleteTestimonial(id: string) {
    return this.request(`/api/testimonials/${id}`, {
      method: "DELETE",
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  //  ADMIN STATS
  // ─────────────────────────────────────────────────────────────────────

  async getAdminStats() {
    return this.request("/api/admin/stats");
  }
}

export const api = new ApiService();
export default api;