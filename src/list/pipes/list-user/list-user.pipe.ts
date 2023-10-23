import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ListUserPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if(!parseInt(value.userId)) {
      throw new HttpException('userId must be a number', HttpStatus.BAD_REQUEST)
    }
    if(!parseInt(value.listId)) {
      throw new HttpException('listId must be a number', HttpStatus.BAD_REQUEST)
    }
    return { ...value, userId: parseInt(value.userId), listId: parseInt(value.listId) };
  }
}
