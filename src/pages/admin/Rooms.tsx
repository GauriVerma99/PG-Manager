import React, { useEffect, useState } from 'react';
import { getRooms, type Room, createRoom } from '../../services/roomService';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export const Rooms: React.FC = () => {
  const { profile } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomCap, setNewRoomCap] = useState(1);

  useEffect(() => {
    if (profile?.pgId) {
      loadRooms();
    } else if (profile) {
      setLoading(false); // If no pgId (e.g. inactive or setup needed), stop loading
    }
  }, [profile]);

  const loadRooms = async () => {
    try {
      const data = await getRooms(profile!.pgId);
      setRooms(data);
    } catch (error) {
      console.error("Failed to load rooms", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.pgId || !newRoomName) return;
    try {
      await createRoom(profile.pgId, newRoomName, newRoomCap);
      setNewRoomName('');
      setNewRoomCap(1);
      setIsCreating(false);
      loadRooms();
    } catch (error) {
      console.error("Failed to create room", error);
    }
  };

  if (loading) return <div className="page-content">Loading rooms...</div>;

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Rooms & Beds Management</h2>
        <Button onClick={() => setIsCreating(true)}>+ Add Room</Button>
      </div>

      {isCreating && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Create New Room</h3>
          <form onSubmit={handleCreateRoom} style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Room Name/Number</label>
              <input 
                type="text" 
                value={newRoomName} 
                onChange={e => setNewRoomName(e.target.value)} 
                required 
                style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Capacity (Beds)</label>
              <input 
                type="number" 
                min="1" 
                value={newRoomCap} 
                onChange={e => setNewRoomCap(Number(e.target.value))} 
                required 
                style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
              />
            </div>
            <Button type="submit" variant="primary">Save</Button>
            <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {rooms.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }}>No rooms found. Add a room to get started.</div>
        ) : (
          rooms.map(room => (
            <div key={room.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.125rem' }}>Room {room.name}</h3>
                <span style={{ fontSize: '0.875rem', backgroundColor: 'var(--bg-main)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
                  Capacity: {room.capacity}
                </span>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <Button variant="secondary" size="sm" style={{ width: '100%' }}>Manage Beds</Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
