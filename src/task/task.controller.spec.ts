import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskDto } from './dto/task.dto';

describe('ListController', () => {
    let controller: TaskController;

    const taskDto = {
        listId: "1",
        title: "Title 1",
        description: "Desc 1",
        deadline: new Date("2023-11-16T11:44:19.617Z")
    }

    const mockCreatedTask = {
        "id": 9,
        "createdAt": "2023-11-21T10:03:22.948Z",
        "updatedAt": "2023-11-21T10:03:22.948Z",
        "listId": 12,
        "userId": 2,
        "title": "task12",
        "description": "desc12",
        "flag": "active",
        "deadline": "2023-11-28T13:34:55.897Z",
        "list": {
            "id": 12,
            "createdAt": "2023-11-16T12:02:35.538Z",
            "updatedAt": "2023-11-16T12:02:35.538Z",
            "title": "list12",
            "description": null
        },
        "user": {
            "id": 2,
            "createdAt": "2023-10-23T08:36:34.899Z",
            "updatedAt": "2023-11-21T10:02:42.446Z",
            "email": "adam77@email.com",
            "firstName": null,
            "lastName": null
        }
    }

    const mockChangedFLag = {
        "id": 1,
        "createdAt": "2023-10-23T08:56:26.352Z",
        "updatedAt": "2023-11-21T10:08:16.169Z",
        "listId": 1,
        "userId": 1,
        "title": "task4",
        "description": "desc4",
        "flag": "cancelled",
        "deadline": "2023-11-28T13:34:55.897Z"
    }

    const mockTaskService = {
        createTask: jest.fn().mockImplementation((taskDto, listId, userId) => {
            return mockCreatedTask
        }),
        changeFlag: jest.fn().mockImplementation((dto, taskId, userId) => {
            return mockChangedFLag
        })
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TaskController],
            providers: [TaskService]
        })
          .overrideProvider(TaskService)
          .useValue(mockTaskService)
          .compile();

        controller = module.get<TaskController>(TaskController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createTask', () => {
        it('should create a task', () => {
            expect(controller.createTask(taskDto, 2))
                .toEqual(mockCreatedTask)
            
            expect(mockTaskService.createTask).toHaveBeenCalled()
        })
    })

    describe('changeFlag', () => {
        it('should change a task flag', () => {
            expect(controller.changeFlag(3, { "flag": "cancelled" }, 1))
                .toEqual(mockChangedFLag)

            expect(mockTaskService.changeFlag).toHaveBeenCalled()
        })
    })
});
