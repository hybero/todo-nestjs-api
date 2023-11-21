import { Test, TestingModule } from '@nestjs/testing';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { ListUserDto } from './dto/list-user.dto';

describe('ListController', () => {
    let controller: ListController;

    const mockCreatedList = {
        "id": 9,
        "createdAt": "2023-11-16T08:59:35.477Z",
        "updatedAt": "2023-11-16T08:59:35.477Z",
        "title": "New List",
        "description": null,
        "users": [
            {
                "id": 2,
                "createdAt": "2023-10-23T08:36:34.899Z",
                "updatedAt": "2023-11-16T08:59:04.835Z",
                "email": "adam77@email.com",
                "firstName": null,
                "lastName": null
            }
        ]
    }

    const mockSharedList = {
        "id": 9,
        "createdAt": "2023-11-16T08:59:35.477Z",
        "updatedAt": "2023-11-16T08:59:35.477Z",
        "title": "list9",
        "description": null,
        "users": [
            {
                "id": 2,
                "createdAt": "2023-10-23T08:36:34.899Z",
                "updatedAt": "2023-11-16T09:17:44.625Z",
                "email": "adam77@email.com",
                "firstName": null,
                "lastName": null
            },
            {
                "id": 1,
                "createdAt": "2023-10-23T08:18:44.174Z",
                "updatedAt": "2023-11-02T16:31:18.088Z",
                "email": "john77@gmail.com",
                "firstName": "John",
                "lastName": "Constantine"
            }
        ],
        "tasks": []
    }

    const mockMyLists = [
        {
            "id": 1,
            "createdAt": "2023-10-23T08:34:40.260Z",
            "updatedAt": "2023-10-23T08:34:40.260Z",
            "title": "list1",
            "description": "desc1",
            "tasks": [
                {
                    "id": 2,
                    "createdAt": "2023-10-23T08:57:13.639Z",
                    "updatedAt": "2023-10-23T08:57:13.639Z",
                    "listId": 1,
                    "userId": 1,
                    "title": "task1",
                    "description": "desc1",
                    "flag": "active",
                    "deadline": "2023-11-28T13:34:55.897Z",
                    "user": {
                        "id": 1,
                        "createdAt": "2023-10-23T08:18:44.174Z",
                        "updatedAt": "2023-11-02T16:31:18.088Z",
                        "email": "john77@gmail.com",
                        "firstName": "John",
                        "lastName": "Constantine"
                    }
                }
            ]
        }
    ]

    const mockListUserDto: ListUserDto = {
        listId: '1',
        userId: '1'
    }

    const mockListService = {
        createList: jest.fn((dto, userId) => {
            return mockCreatedList
        }),
        getAllLists: jest.fn(() => {
            return [mockCreatedList]
        }),
        shareList: jest.fn((dto, userId) => {
            return mockSharedList
        }),
        getMyLists: jest.fn((userId) => {
            return mockMyLists
        })
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ListController],
            providers: [ListService]
        })
          .overrideProvider(ListService)
          .useValue(mockListService)
          .compile();

        controller = module.get<ListController>(ListController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create a list', () => {
        expect(controller.createList({ title: 'New List' }, 2))
            .toEqual(mockCreatedList)
        
        expect(mockListService.createList).toHaveBeenCalled()
    })

    it('should return all lists', () => {
        expect(controller.getAllLists()).toEqual([mockCreatedList])

        expect(mockListService.getAllLists).toHaveBeenCalled()
    })

    it('should share a list with another user', () => {
        expect(controller.shareList(mockListUserDto, 2)).toEqual(mockSharedList)

        expect(mockListService.shareList).toHaveBeenCalled()
    })

    it('should return all lists belonging to the user', () => {
        expect(controller.getMyLists(2)).toEqual(mockMyLists)

        expect(mockListService.getMyLists).toHaveBeenCalled()
    })
});
