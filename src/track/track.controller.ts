import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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
  getTrackById(@Param('id') id: string): Promise<Track | undefined> {
    return this.trackService.getTrackById(id);
  }

  @Post()
  createTrack(@Body() body: Track): Promise<Track | undefined> {
    return this.trackService.createTrack(body);
  }

  @Delete(':id')
  deleteTrackById(@Param('id') id: string): Promise<Track | undefined> {
    return this.trackService.deleteTrackById(id);
  }

  @Put(':id')
  updateTrackById(
    @Param('id') id: string,
    @Body() body: Track,
  ): Promise<Track | undefined> {
    return this.trackService.updateTrackById(id, body);
  }
}
