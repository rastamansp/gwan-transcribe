import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Request,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TranscriptionResponseDto } from '../../application/dto/transcription-response.dto';
import { UploadTranscriptionDto } from '../../application/dto/upload-transcription.dto';
import { UploadTranscriptionUseCase } from '../../application/use-cases/upload-transcription.use-case';
import { GetTranscriptionUseCase } from '../../application/use-cases/get-transcription.use-case';
import { GetTranscriptionsUseCase } from '../../application/use-cases/get-transcriptions.use-case';
import { AuthGuard } from '../../../user/infrastructure/guards/auth.guard';

@ApiTags('transcriptions')
@Controller('transcription')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class TranscriptionController {
  constructor(
    private readonly uploadTranscriptionUseCase: UploadTranscriptionUseCase,
    private readonly getTranscriptionUseCase: GetTranscriptionUseCase,
    private readonly getTranscriptionsUseCase: GetTranscriptionsUseCase,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
  @ApiOperation({ summary: 'Upload de arquivo de áudio para transcrição' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo de áudio para transcrição',
    type: UploadTranscriptionDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Arquivo enviado com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            status: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  })
  async uploadTranscription(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100 * 1024 * 1024 }), // 100MB
          // Validação de tipo será feita na camada de use case; aqui mantemos apenas o tamanho
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() uploadDto: UploadTranscriptionDto,
    @Request() req: any,
  ) {
    const result = await this.uploadTranscriptionUseCase.execute({
      file,
      userId: req.user.sub || req.user.id,
      language: uploadDto.language?.toString() || undefined,
    });

    return {
      success: true,
      data: result,
      message: 'Arquivo enviado com sucesso',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter transcrição por ID' })
  @ApiResponse({
    status: 200,
    description: 'Transcrição encontrada',
    type: TranscriptionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Transcrição não encontrada',
  })
  async getTranscription(@Param('id') id: string, @Request() req: any) {
    const transcription = await this.getTranscriptionUseCase.execute({
      id,
      userId: req.user.sub || req.user.id,
    });

    return {
      success: true,
      data: transcription,
      message: 'Transcrição encontrada',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar transcrições do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de transcrições',
    type: [TranscriptionResponseDto],
  })
  async getTranscriptions(@Request() req: any) {
    const transcriptions = await this.getTranscriptionsUseCase.execute({
      userId: req.user.sub || req.user.id,
    });

    return {
      success: true,
      data: transcriptions,
      message: 'Transcrições encontradas',
    };
  }
}
