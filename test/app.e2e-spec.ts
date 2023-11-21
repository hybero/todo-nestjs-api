import { Test } from "@nestjs/testing"
import { AppModule } from "./../src/app.module"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { PrismaService } from "../src/prisma/prisma.service"
import * as pactum from 'pactum'
import { AuthDto } from "src/auth/dto"
import { EditUserDto } from "src/user/dto"
import { ListDto } from "src/list/dto/list.dto"

describe('App e2e', () => {
  
    let app: INestApplication
    let prisma: PrismaService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = moduleRef.createNestApplication()
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true // trimming unwanted properties sent to dto
        }))

        await app.init()
        await app.listen(3330)

        prisma = app.get(PrismaService)
        await prisma.cleanDb()

        pactum.request.setBaseUrl('http://localhost:3330')
    })

    afterAll(() => {
        app.close()
    })

    describe('Auth', () => {
        describe('Register', () => {
            it('should throw if empty email', async () => {
                return await pactum
                    .spec()
                    .post('/auth/register')
                    .withBody({ password: '123' })
                    .expectStatus(400)
            })

            it('should throw if empty password', async () => {
                return await pactum
                    .spec()
                    .post('/auth/register')
                    .withBody({ email: 'john77@email.com' })
                    .expectStatus(400)
            })

            it('should throw if no body provided', async () => {
                return await pactum
                    .spec()
                    .post('/auth/register')
                    .expectStatus(400)
            })

            it('should register 1st user', async () => {
                const dto: AuthDto = {
                    email: 'john77@email.com',
                    password: 'john123'
                }
                return await pactum
                    .spec()
                    .post('/auth/register')
                    .withBody(dto)
                    .expectStatus(201)
                    .expectJsonLike({
                        "access_token": "typeof $V === 'string'",
                        "refresh_token": "typeof $V === 'string'",
                    })
            })

            it('should register 2nd user', async () => {
                const dto: AuthDto = {
                    email: 'adam77@email.com',
                    password: 'adam123'
                }
                return await pactum
                    .spec()
                    .post('/auth/register')
                    .withBody(dto)
                    .expectStatus(201)
                    .expectJsonLike({
                        "access_token": "typeof $V === 'string'",
                        "refresh_token": "typeof $V === 'string'",
                    })
            })
        })

        describe('Login', () => {
            it('should throw if empty email', async () => {
                return await pactum
                    .spec()
                    .post('/auth/login')
                    .withBody({ password: '123' })
                    .expectStatus(400)
            })

            it('should throw if empty password', async () => {
                return await pactum
                    .spec()
                    .post('/auth/login')
                    .withBody({ email: 'john77@email.com' })
                    .expectStatus(400)
            })

            it('should throw if no body provided', async () => {
                return await pactum
                    .spec()
                    .post('/auth/login')
                    .expectStatus(400)
            })

            it('should login', async () => {
                const dto: AuthDto = {
                    email: 'john77@email.com',
                    password: 'john123'
                }
                return await pactum
                    .spec()
                    .post('/auth/login')
                    .withBody(dto)
                    .expectStatus(200)
                    .expectJsonLike({
                        "access_token": "typeof $V === 'string'",
                        "refresh_token": "typeof $V === 'string'",
                    })
                    .stores('userAt', 'access_token')
            })
        })
    })

    describe('User', () => {
        describe('Get Me', () => {
            it('should return my user details', async () => {
                return await pactum
                    .spec()
                    .get('/users/me')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .expectStatus(200)
            })
        })

        describe('Edit User', () => {
            it('should edit user', async () => {
                const dto: EditUserDto = {
                    firstName: 'Pavol',
                    email: 'pavol77@gmail.com'
                }
                return await pactum
                    .spec()
                    .put('/users')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody(dto)
                    .expectStatus(200)
            })
        })
    })

    describe('List', () => {
        describe('Create List', () => {
            it('should throw if title is missing', async () => {
                return await pactum
                    .spec()
                    .post('/lists')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody({ description: 'desc 1' })
                    .expectStatus(400)
            })

            it('should create list', async () => {
                const dto: ListDto = {
                    title: 'title 1',
                    description: 'desc 1'
                }
                return await pactum
                    .spec()
                    .post('/lists')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody(dto)
                    .expectStatus(201)
                    .stores('listId', 'id')
            })
        })

        describe('Share List', () => {
            it('should throw if listId missing', async () => {
                return await pactum
                    .spec()
                    .post('/lists/share')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody({ userId: '2' })
                    .expectStatus(400)
            })

            it('should throw if userId missing', async () => {
                return await pactum
                    .spec()
                    .post('/lists/share')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody({ listId: '1' })
                    .expectStatus(400)
            })

            it('should share list', async () => {
                return await pactum
                    .spec()
                    .post('/lists/share')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody({
                        listId: '$S{listId}',
                        userId: '2'
                    })
                    .expectStatus(200)
            })
        })

        describe('Get All Lists', () => {
            it('should return all lists', async () => {
                return await pactum
                    .spec()
                    .get('/lists')
                    .expectStatus(200)
            })
        })

        describe('Get My Lists', () => {
            it('should return my lists', async () => {
                return await pactum
                    .spec()
                    .get('/lists/my')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .expectStatus(200)
            })
        })
    })

    describe('Task', () => {
        describe('Create Task', () => {
            it('should throw if listId missing', async () => {
                return await pactum
                    .spec()
                    .post('/tasks')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody({
                        title: 'title 1',
                        description: 'desc 1',
                        deadline: '2023-11-22T16:56:53.080Z'
                    })
                    .expectStatus(400)
            })

            it('should throw if title missing', async () => {
                return await pactum
                    .spec()
                    .post('/tasks')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody({
                        listId: '$S{listId}',
                        description: 'desc 1',
                        deadline: '2023-11-22T16:56:53.080Z'
                    })
                    .expectStatus(400)
            })

            it('should throw if description missing', async () => {
                return await pactum
                    .spec()
                    .post('/tasks')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody({
                        listId: '$S{listId}',
                        title: 'title 1',
                        deadline: '2023-11-22T16:56:53.080Z'
                    })
                    .expectStatus(400)
            })

            it('should throw if deadline missing', async () => {
                return await pactum
                    .spec()
                    .post('/tasks')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody({
                        listId: '$S{listId}',
                        title: 'title 1',
                        description: 'desc 1'
                    })
                    .expectStatus(400)
            })

            it('should create task', async () => {
                return await pactum
                    .spec()
                    .post('/tasks')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody({
                        listId: '$S{listId}',
                        title: 'title 1',
                        description: 'desc 1',
                        deadline: '2023-11-22T16:56:53.080Z'
                    })
                    .expectStatus(201)
                    .stores('taskId', 'id')
            })
        })

        describe('Change Flag', () => {
            it('should throw if flag out of enum', async () => {
                return await pactum
                    .spec()
                    .post('/tasks/$S{taskId}/changeflag')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody({
                        flag: 'something out of enum'
                    })
                    .expectStatus(400)
            })
            
            it('should change flag', async () => {
                return await pactum
                    .spec()
                    .post('/tasks/$S{taskId}/changeflag')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody({
                        flag: 'finished'
                    })
                    .expectStatus(200)
            })
        })
    })
})