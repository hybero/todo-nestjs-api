import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TaskPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if(!Number(value.listId)) {
      throw new HttpException('listId must be a number', HttpStatus.BAD_REQUEST)
    }
    return { ...value, listId: Number(value.listId) };
  }
}
