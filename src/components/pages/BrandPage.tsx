import { useState } from 'react';
import { User } from '../../App';
import { useBrandStore } from '../../store/brandStore';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';

interface BrandPageProps {
  user: User;
}

export default function BrandPage({ user }: BrandPageProps) {
  const brands = useBrandStore(state => state.brands);
  const addBrand = useBrandStore(state => state.addBrand);
  const updateBrand = useBrandStore(state => state.updateBrand);
  const deleteBrand = useBrandStore(state => state.deleteBrand);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  if (user.role !== 'admin') {
    return <div className="p-8">Access denied</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      updateBrand(editingId, formData);
      setEditingId(null);
    } else {
      addBrand(formData);
      setIsAdding(false);
    }
    setFormData({ name: '', description: '' });
  };

  const handleEdit = (id: string) => {
    const brand = brands.find(b => b.id === id);
    if (brand) {
      setFormData({ name: brand.name, description: brand.description });
      setEditingId(id);
      setIsAdding(true);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-[#1f2937] mb-2">Brand Management</h1>
        <p className="text-[#6b7280] text-sm md:text-base">Manage brands for live rooms</p>
      </div>
      
      <div className="max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <p className="text-[#6b7280] text-sm md:text-base">Total Brands: {brands.length}</p>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#2a6ef0] text-white px-4 py-2 rounded-lg hover:bg-[#1e5dd8] transition-colors touch-manipulation"
            >
              <Plus className="size-5" />
              Add Brand
            </button>
          )}
        </div>

        {isAdding && (
          <div className="bg-white rounded-xl p-4 md:p-6 border border-[#e5e7eb] mb-6">
            <h3 className="text-[#1f2937] mb-4">
              {editingId ? 'Edit Brand' : 'Add New Brand'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#364153] mb-2 text-sm md:text-base">Brand Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0] text-base"
                  placeholder="Enter brand name"
                  required
                />
              </div>
              <div>
                <label className="block text-[#364153] mb-2 text-sm md:text-base">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-[#d1d5dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6ef0] text-base"
                  placeholder="Enter brand description"
                  rows={3}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#2a6ef0] text-white px-6 py-2 rounded-lg hover:bg-[#1e5dd8] transition-colors touch-manipulation"
                >
                  {editingId ? 'Update' : 'Add'} Brand
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto bg-[#f3f4f6] text-[#4a5565] px-6 py-2 rounded-lg hover:bg-[#e5e7eb] transition-colors touch-manipulation"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {brands.map(brand => (
            <div
              key={brand.id}
              className="bg-white rounded-xl p-5 md:p-6 border border-[#e5e7eb] hover:border-[#2a6ef0] transition-all group"
            >
              {/* Brand Icon */}
              <div className="flex items-start justify-between mb-4">
                <div className="bg-[#f0f5ff] p-3 rounded-xl group-hover:bg-[#dbeafe] transition-colors">
                  <Package className="size-6 text-[#2a6ef0]" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(brand.id)}
                    className="p-2 text-[#2a6ef0] hover:bg-[#f3f4f6] rounded-lg transition-colors touch-manipulation"
                    title="Edit brand"
                  >
                    <Edit2 className="size-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this brand?')) {
                        deleteBrand(brand.id);
                      }
                    }}
                    className="p-2 text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors touch-manipulation"
                    title="Delete brand"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              {/* Brand Info */}
              <div>
                <h3 className="text-[#1f2937] mb-2 line-clamp-1">{brand.name}</h3>
                <p className="text-[#6b7280] text-sm line-clamp-2 min-h-[40px]">
                  {brand.description || 'No description'}
                </p>
              </div>
            </div>
          ))}

          {brands.length === 0 && !isAdding && (
            <div className="col-span-full bg-white rounded-xl p-8 md:p-12 border border-[#e5e7eb] text-center">
              <div className="bg-[#f0f5ff] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="size-8 text-[#2a6ef0]" />
              </div>
              <p className="text-[#9ca3af] mb-4 text-sm md:text-base">No brands added yet</p>
              <button
                onClick={() => setIsAdding(true)}
                className="text-[#2a6ef0] hover:underline"
              >
                Add your first brand
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}