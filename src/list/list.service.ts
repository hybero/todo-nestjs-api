import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListDto } from './dto/list.dto';
import { ListUserDto } from './dto/list-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ListService {
    constructor(
        private prisma: PrismaService
    ) {}

    async createList(dto: ListDto, userId: number) {
        // create new list
        const list = await this.prisma.list.create({
            data: {
                title: dto.title,
                description: dto.description
            }
        })
        // create entry in joining table - users_lists
        await this.prisma.listUser.create({
            data: {
                userId: userId,
                listId: list.id
            }
        })
        // get the list with joined user
        const listWithUsers = await this.prisma.list.findUnique({
            where: {
                id: list.id
            },
            include: {
                users: {
                    include: {
                        user: true
                    }
                }
            }
        })
        // Modify the data structure to exclude unwanted properties from joining table
        const modifiedList = this.modifyListData(listWithUsers)
        return modifiedList
    }

    async getAllLists() {
        // get all lists
        const lists = await this.prisma.list.findMany({
            include: {
                users: {
                    include: {
                        user: true
                    }
                }
            }
        })
        // Modify the data structure to exclude unwanted properties from joining table
        const modifiedLists = []
        lists.forEach(list => {
            modifiedLists.push(this.modifyListData(list))
        })
        return modifiedLists
    }

    async shareList(dto: ListUserDto, requestingUserId: number) {  
        // if list does not exists
        let list = await this.prisma.list.findUnique({
            where: { id: Number(dto.listId) }
        })
        if(!list) throw new NotFoundException('List does not exists')
        // if list does not belongs to requesting user
        list = await this.prisma.list.findFirst({
            where: {
                id: Number(dto.listId),
                users: {
                    some: {
                        userId: Number(requestingUserId),
                    },
                },
            },
        });
        if(!list) throw new ForbiddenException('List does not belong to the requesting user')
        // if user does not exists
        const user = await this.prisma.user.findUnique({
            where: { id: Number(dto.userId) }
        })
        if(!user) throw new NotFoundException('User does not exist')
        // if user shares list with himself
        if(Number(dto.userId) === requestingUserId) throw new ConflictException('User can not share list with themselves')

        // Proceed after checks and data validation
        try {
            // create entry in joining table
            const listUser = await this.prisma.listUser.create({
                data: {
                    userId: Number(dto.userId),
                    listId: Number(dto.listId)
                }
            })
        } catch(error) {
            // if duplicate entry
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code === 'P2002') {
                    return { message: 'The list has already been shared with the user. No duplicate entry created.' }
                }
            }
            throw error
        }
        // get list with users included
        const listWithUsers = await this.prisma.list.findUnique({
            where: {
                id: Number(dto.listId)
            },
            include: {
                users: {
                    include: {
                        user: true
                    }
                }
            }
        })
        // Modify the data structure to exclude unwanted properties from joining table
        const modifiedList = this.modifyListData(listWithUsers)
        return modifiedList
    }

    async getMyLists(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { 
                id: userId 
            },
            include: {
                lists: { 
                    include: {
                        list: true 
                    }
                } 
            },
        });
        // extract only details of lists
        const modifiedLists = []
        user.lists.forEach(list => {
            modifiedLists.push({ ...list.list })
        })
        return modifiedLists
    }

    // Modify the data structure to exclude unwanted properties from joining table
    modifyListData(lists: any) {
        const modifiedList = { ... lists, users: [] }
        if (lists && lists.users) {
            modifiedList.users = lists.users.map(listUser => {
                const { id, userId, listId, ...userDetails } = listUser;
                return userDetails.user;
            });
        }
        return modifiedList
    }

    // Modify the data structure to exclude unwanted properties from joining table
    modifyMyListData(lists: any) {
        const modifiedList = []
    }
}
