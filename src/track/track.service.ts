import { Injectable } from '@nestjs/common';
import { Track } from './track.interface';

const BASE_URL = 'http://localhost:3030/tracks/';

@Injectable()
export class TrackService {
  async createTrack(track: Track): Promise<Track | undefined> {
    try {
      const idn = await this.setId();
      const newTrack: Track = {
        id: idn.toString(),
        title: track.title,
        artist: track.artist,
        duration: track.duration,
      };
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrack),
      });
      if (!res.ok) {
        console.error('Error al crear track:', res.status, await res.text());
        return undefined;
      }
      return await res.json();
    } catch (error) {
      console.error('Error en createTrack:', error);
      return undefined;
    }
  }

  async getTracks(): Promise<Track[]> {
    try {
      const res = await fetch(BASE_URL);
      if (!res.ok) {
        console.error('Error al obtener tracks:', res.status, await res.text());
        return [];
      }
      return await res.json();
    } catch (error) {
      console.error('Error en getTracks:', error);
      return [];
    }
  }

  async getTrackById(id: string): Promise<Track | undefined> {
    try {
      const res = await fetch(BASE_URL + id);
      if (!res.ok) {
        console.error('Track no encontrado:', res.status, await res.text());
        return undefined;
      }
      return await res.json();
    } catch (error) {
      console.error('Error en getTrackById:', error);
      return undefined;
    }
  }

  private async setId(): Promise<number> {
    const tracks = await this.getTracks();
    const lastTrack = tracks[tracks.length - 1];
    const lastId = lastTrack ? Number(lastTrack.id) : 0;
    return lastId + 1;
  }

  async deleteTrackById(id: string): Promise<Track | undefined> {
    try {
      const res = await fetch(BASE_URL + id, { method: 'DELETE' });
      if (!res.ok) {
        console.error('Error al eliminar track:', res.status, await res.text());
        return undefined;
      }
      return await res.json();
    } catch (error) {
      console.error('Error en deleteTrackById:', error);
      return undefined;
    }
  }

  async updateTrackById(id: string, body: Track): Promise<Track | undefined> {
    try {
      const res = await fetch(BASE_URL + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        console.error(
          'Error al actualizar track:',
          res.status,
          await res.text(),
        );
        return undefined;
      }
      return await res.json();
    } catch (error) {
      console.error('Error en updateTrackById:', error);
      return undefined;
    }
  }
}
