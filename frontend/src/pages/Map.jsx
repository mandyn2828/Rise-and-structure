import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Users, Info, Compass, Search, Target } from 'lucide-react';
import { API_URL } from '../api/config';
import { useAuth } from '../context/AuthContext';

const ConnectionMap = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  
  // New location state
  const [locName, setLocName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [interests, setInterests] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API_URL}/map/members`);
      setMembers(res.data);
    } catch (err) {
      console.error('Failed to fetch map members');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLocation = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await axios.post(`${API_URL}/user/location`, {
        location_name: locName,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        interests
      });
      setShowUpdateModal(false);
      fetchMembers();
    } catch (err) {
      console.error('Failed to update location');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse font-body text-text-secondary text-xl">Scanning for nearby builders...</div>;

  return (
    <div className="max-w-6xl mx-auto font-body">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading text-primary mb-2">Local Connection Map</h1>
          <p className="text-text-secondary text-lg">Find your tribe in the real world. Connect for meetups and accountability.</p>
        </div>
        <button 
          onClick={() => setShowUpdateModal(true)}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all flex items-center gap-2"
        >
          <MapPin size={20} />
          Pin My Location
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Map Visualization (Stylized) */}
        <div className="lg:col-span-2">
          <div className="bg-bg-soft rounded-[3rem] border border-border h-[500px] relative overflow-hidden shadow-inner flex items-center justify-center">
            {/* Abstract Radar Effect */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
               <div className="w-[800px] h-[800px] border border-primary rounded-full animate-ping duration-[4000ms]"></div>
               <div className="w-[600px] h-[600px] border border-primary rounded-full animate-ping duration-[3000ms]"></div>
               <div className="w-[400px] h-[400px] border border-primary rounded-full animate-ping duration-[2000ms]"></div>
            </div>
            
            <Compass size={100} className="text-primary opacity-5 absolute top-10 left-10" />

            {/* Stylized Member Pins */}
            <div className="relative w-full h-full">
              {members.map((member, i) => {
                // Mock positioning based on lat/lng for visualization
                const left = ((member.longitude + 180) / 360) * 100;
                const top = ((90 - member.latitude) / 180) * 100;
                
                return (
                  <div 
                    key={member.id}
                    className="absolute group cursor-pointer transition-all hover:z-20"
                    style={{ left: `${left}%`, top: `${top}%` }}
                  >
                    <div className="bg-white p-1 rounded-full border-2 border-primary shadow-lg group-hover:scale-125 transition-transform">
                      <div className="w-8 h-8 bg-bg-soft rounded-full overflow-hidden flex items-center justify-center text-primary">
                        {member.avatar_url ? <img src={member.avatar_url} alt="" /> : <Users size={16} />}
                      </div>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-white rounded-2xl shadow-2xl p-4 border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <p className="font-bold text-primary text-sm">{member.full_name}</p>
                      <p className="text-[10px] text-text-muted uppercase tracking-widest font-black mb-2">{member.location_name}</p>
                      <div className="flex flex-wrap gap-1">
                        {member.interests?.split(',').map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 bg-bg-soft rounded text-[8px] text-text-secondary">{tag.trim()}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="absolute bottom-8 right-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-border text-[10px] font-bold text-text-muted flex items-center gap-3">
               <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 bg-primary rounded-full"></div>
                 Members
               </div>
               <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 bg-accent-gold rounded-full"></div>
                 Thriver Tier
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Nearby Members List */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
            <h2 className="text-xl font-heading text-primary mb-6 flex items-center gap-2">
              <Search size={20} />
              Nearby Members
            </h2>
            <div className="space-y-6">
              {members.length > 0 ? members.slice(0, 5).map(member => (
                <div key={member.id} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-bg-soft rounded-2xl flex items-center justify-center text-primary border border-border group-hover:border-primary transition-colors">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary text-sm">{member.full_name}</p>
                    <p className="text-xs text-text-muted">{member.location_name}</p>
                  </div>
                  <button className="ml-auto p-2 text-text-muted hover:text-primary hover:bg-bg-soft rounded-xl transition-all">
                    <Info size={18} />
                  </button>
                </div>
              )) : (
                <p className="text-center text-text-muted italic py-8">No members found on the map yet.</p>
              )}
            </div>
          </div>

          <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-xl">
             <Target className="mb-6 text-accent-gold" size={32} />
             <h3 className="text-xl font-heading mb-3">Host a Meetup</h3>
             <p className="text-white/70 text-sm leading-relaxed mb-6">
               Organize a local "Rebuild Saturday" or a morning mobility session in your park.
             </p>
             <button className="w-full bg-white text-primary py-3 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all">
               Propose Event
             </button>
          </div>
        </div>
      </div>

      {/* Update Location Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowUpdateModal(false)}></div>
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 relative z-10 border border-border animate-in zoom-in duration-300">
            <h2 className="text-3xl font-heading text-primary mb-2">Pin Your Location</h2>
            <p className="text-text-secondary mb-8">Share your general area to connect with others.</p>
            
            <form onSubmit={handleUpdateLocation} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">City / Region Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Austin, TX"
                  className="w-full bg-bg-soft border border-border rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={locName}
                  onChange={(e) => setLocName(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Latitude</label>
                  <input 
                    type="number" 
                    step="any"
                    placeholder="e.g. 30.26"
                    className="w-full bg-bg-soft border border-border rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Longitude</label>
                  <input 
                    type="number" 
                    step="any"
                    placeholder="e.g. -97.74"
                    className="w-full bg-bg-soft border border-border rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Interests (Tags)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mobility, Stocks, Stoicism"
                  className="w-full bg-bg-soft border border-border rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 bg-bg-soft text-text-secondary py-4 rounded-2xl font-bold hover:bg-border transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Pin Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionMap;
