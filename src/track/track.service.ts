import { Injectable } from '@nestjs/common';
import { Track } from './track.interface';

const BASE_URL = 'http://localhost:3030/tracks/';

@Injectable()
export class TrackService {
  async createTrack(track: Track): Promise<Track> {
    const idn = await this.setId();
    // const newTrack: Track = { ...track, id };
    const newTrack: Track = {
      id: idn.toString(),
      title: track.title,
      artist: track.artist,
      duration: track.duration,
    };
    console.log(
      'Nuevo track a guardar:',
      newTrack,
      'Tipo de id:',
      typeof newTrack.id,
    );
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTrack),
    });
    const parsed = await res.json();
    return parsed;
  }

  async getTracks(): Promise<Track[]> {
    const res = await fetch(BASE_URL);
    const parsed = await res.json();
    return parsed;
  }

  async getTrackById(id: string): Promise<Track> {
    const res = await fetch(BASE_URL + id);
    const parsed = await res.json();
    return parsed;
  }

  private async setId(): Promise<number> {
    const tracks = await this.getTracks();
    const lastTrack = tracks[tracks.length - 1];
    const lastId = lastTrack ? Number(lastTrack.id) : 0;
    return lastId + 1;
  }

  async deleteTrackById(id: string): Promise<Track> {
    const res = await fetch(BASE_URL + id, {
      method: 'DELETE',
    });
    const parsed = await res.json();
    return parsed;
  }

  async updateTrackById(id: string, body: Track): Promise<Track> {
    const res = await fetch(BASE_URL + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const parsed = await res.json();
    return parsed;
  }
}
