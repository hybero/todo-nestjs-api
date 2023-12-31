import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ListUserPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if(!Number(value.userId)) {
      throw new HttpException('userId must be a number', HttpStatus.BAD_REQUEST)
    }
    if(!Number(value.listId)) {
      throw new HttpException('listId must be a number', HttpStatus.BAD_REQUEST)
    }
    return { ...value, userId: Number(value.userId), listId: Number(value.listId) };
  }
}
