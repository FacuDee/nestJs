import { Controller, Get, Param } from '@nestjs/common';
import { TrackService } from './track.service';
import { Track } from './track.interface';

@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}
  @Get()
  getTracks(): Promise<Track[]> {
    return this.trackService.getTracks();
  }

  @Get(':id')
  getTrackById(@Param('id') id: string): Promise<Track> {
    return this.trackService.getTrackById(Number(id));
  }
}
