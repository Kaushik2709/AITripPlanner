import { useState } from 'react';
import { MapPin, Clock, Wallet, Users, Sparkles } from 'lucide-react';
import { TripFormData } from '@/types/trip';
import { motion } from 'framer-motion';
import travelHero from '@/assets/travel-hero.jpg';

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  isLoading: boolean;
}


const companionOptions = ['Solo', 'Couple', 'Family', 'Friends', 'Business'];

export function TripForm({ onSubmit, isLoading }: TripFormProps) {
  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    duration: '',
    budget: '',
    companions: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.destination || !formData.duration || !formData.budget || !formData.companions) return;
    onSubmit(formData);
  };

  const isValid = formData.destination && formData.duration && formData.budget && formData.companions;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Hero area */}
        <div className="relative rounded-2xl overflow-hidden mb-8 shadow-elevated">
          <img
            src={travelHero}
            alt="Travel"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent flex items-end p-6">
            <div>
              <h1 className="font-heading text-3xl font-bold text-primary-foreground mb-1">
                Where to next?
              </h1>
              <p className="text-primary-foreground/80 text-sm">
                Let AI craft your perfect itinerary
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Destination */}
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Where do you want to go?"
              value={formData.destination}
              onChange={e => setFormData(prev => ({ ...prev, destination: e.target.value }))}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-card text-sm"
            />
          </div>

          {/* Duration */}
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Duration (e.g., 14 days in days)"
              value={formData.duration}
              onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-card text-sm"
            />
          </div>

          {/* Budget */}
          <div className="relative">
            <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="number"
              placeholder="Budget (e.g., 1500)"
              value={formData.budget}
              onChange={e => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              min="0"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-card text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Companions */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Traveling with</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {companionOptions.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, companions: opt }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.companions === opt
                      ? 'gradient-warm text-accent-foreground shadow-card'
                      : 'bg-card border border-border text-foreground hover:border-accent/40'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={!isValid || isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3.5 rounded-xl gradient-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-elevated transition-shadow hover:shadow-card"
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? 'Planning your trip...' : 'Plan My Trip'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
