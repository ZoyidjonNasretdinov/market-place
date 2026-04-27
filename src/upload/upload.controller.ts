import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Uploads')
@Controller('upload')
@ApiBearerAuth()
export class UploadController {
  @Post('image')
  @ApiOperation({
    summary: 'Bitta rasm yuklash',
    description:
      "Mahsulot yoki profil uchun bitta rasm yuklash. Rasm 'uploads/' papkasiga saqlanadi.",
  })
  @ApiResponse({ status: 201, description: 'Rasm yuklandi va URL qaytarildi.' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'Rasm muvaffaqiyatli yuklandi',
      url: `/uploads/${file.filename}`,
    };
  }

  @Post('images')
  @ApiOperation({
    summary: 'Bir nechta rasm yuklash',
    description:
      "Bir vaqtning o'zida bir nechta (maksimal 10 ta) rasm yuborish. Galereya uchun mo'ljallangan.",
  })
  @ApiResponse({
    status: 201,
    description: "Barcha rasmlar yuklandi va URL-lar ro'yxati qaytarildi.",
  })
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  uploadImages(@UploadedFiles() files: Array<Express.Multer.File>) {
    return files.map((file) => ({
      url: `/uploads/${file.filename}`,
    }));
  }
}
