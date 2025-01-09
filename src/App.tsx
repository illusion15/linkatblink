import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit, Youtube, Globe, Share2, Image as ImageIcon, ExternalLink, Facebook, Twitter, Instagram, Linkedin, Mail, Rss } from 'lucide-react';

interface Card {
  id: string;
  title: string;
  description: string;
  link: string;
  type: 'website' | 'youtube' | 'blog' | 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'email' | 'other';
  image: string;
  createdAt: string;
}

function App() {
  const [cards, setCards] = useState<Card[]>(() => {
    const savedCards = localStorage.getItem('cards');
    return savedCards ? JSON.parse(savedCards) : [];
  });
  
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [activeFilter, setActiveFilter] = useState<Card['type'] | 'all'>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    type: 'website',
    image: ''
  });

  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCard) {
      setCards(cards.map(card => 
        card.id === editingCard.id 
          ? { ...card, ...formData }
          : card
      ));
      setEditingCard(null);
    } else {
      const newCard: Card = {
        id: crypto.randomUUID(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      setCards([newCard, ...cards]);
    }
    setFormData({ title: '', description: '', link: '', type: 'website', image: '' });
    setShowForm(false);
  };

  const handleEdit = (card: Card) => {
    setEditingCard(card);
    setFormData({
      title: card.title,
      description: card.description,
      link: card.link,
      type: card.type,
      image: card.image
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="w-5 h-5 text-red-500" />;
      case 'blog':
        return <Rss className="w-5 h-5 text-orange-500" />;
      case 'facebook':
        return <Facebook className="w-5 h-5 text-blue-600" />;
      case 'twitter':
        return <Twitter className="w-5 h-5 text-blue-400" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5 text-blue-700" />;
      case 'email':
        return <Mail className="w-5 h-5 text-gray-600" />;
      default:
        return <Globe className="w-5 h-5 text-green-500" />;
    }
  };

  const filteredCards = activeFilter === 'all' 
    ? cards 
    : cards.filter(card => card.type === activeFilter);

  const cardTypes: Card['type'][] = ['website', 'youtube', 'blog', 'facebook', 'twitter', 'instagram', 'linkedin', 'email', 'other'];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Link Cards</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Add Card
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={\`px-4 py-2 rounded-lg \${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }\`}
          >
            All
          </button>
          {cardTypes.map(type => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={\`px-4 py-2 rounded-lg flex items-center gap-2 \${
                activeFilter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }\`}
            >
              {getIcon(type)}
              <span className="capitalize">{type}</span>
            </button>
          ))}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                {editingCard ? 'Edit Card' : 'Add New Card'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Link</label>
                  <input
                    type="url"
                    required
                    value={formData.link}
                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as Card['type'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {cardTypes.map(type => (
                      <option key={type} value={type} className="capitalize">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
                  <div className="mt-1 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <div className="- or -">
                      <input
                        type="url"
                        placeholder="Or enter image URL"
                        value={formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCard(null);
                      setFormData({ title: '', description: '', link: '', type: 'website', image: '' });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    {editingCard ? 'Save Changes' : 'Add Card'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map(card => (
            <div
              key={card.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {card.image && (
                <div className="aspect-video bg-gray-100">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x225?text=No+Image';
                    }}
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getIcon(card.type)}
                    <span className="text-sm font-medium text-gray-500 capitalize">
                      {card.type}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(card)}
                      className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {card.title}
                </h3>
                {card.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{card.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Added: {new Date(card.createdAt).toLocaleDateString()}
                  </span>
                  <a
                    href={card.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Visit <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {activeFilter === 'all' 
                ? "No cards yet. Click 'Add Card' to create one!"
                : \`No ${activeFilter} cards found. Add some or try a different filter.\`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;