//Apa saja yang perlu diimport untuk testing
const request = require('supertest')
const {Comment,User,Photo} = require('../models')
const {generateToken} = require('../helpers/jwt')
const app = require('../index')
//bagaimana cara membuat test case untuk delete
const userData = {
    full_name: "admin",
    email: "admin@gmail.com",
    username: "admin",
    password: "123456",
    profile_image_url: "admin.com",
    age: 21,
    phone_number: "82112324",
  }

describe("Get comments",()=>{
    let token

    beforeAll(async()=>{
        try{
            const user = await User.create(userData)
            token = generateToken({
                id: user.id,
                email: user.email,
                full_name: user.full_name,
            })
        }catch(err){
            console.log(err)
        }
    })
    afterAll(async()=>{
        try{
            await User.destroy({where: {}})
        }catch(err){
            console.log(err)
        }
    })
    it("should send 200 statuscode",(done)=>{
        request(app)
            .get("/comments")
            .set("token",token)
            .end(function(err,res){
                if(err){
                    done(err)
                }
                expect(res.status).toEqual(200)
                expect(res.statusType).toEqual(2)
                expect(res.type).toEqual("application/json")
                expect(res.ok).toEqual(true)
                expect(res.body).toHaveProperty("comments")
                expect(typeof res.body.comments).toEqual("object")
            })
    })
    it("should send 401 statuscode",(done)=>{
        request(app)
            .get("/comments")
            .end(function (err,res){
                if(err){
                    done(err)
                }
                expect(res.status).toEqual(401)
                expect(res.statusType).toEqual(4)
                expect(res.type).toEqual("application/json")
                expect(res.unauthorized).toEqual(true)
                expect(res.body).toHaveProperty("name")
                expect(res.body).toHaveProperty("message")
                expect(res.body.name).toEqual("JsonWebTokenError")
                expect(res.body.message).toEqual("jwt must be provided")
                done()
            })
    })
})
describe("Delete comments/:commentid",()=>{
    let id
    let token
    let commentId
    let photoId
    //apa saja yang disiapkan sebelum dan sesudah testcase berjalan
    beforeAll(async()=>{
        try{
            const user = await User.create(userData)
            id = user.id
            token = generateToken({
              id: user.id,
              email: user.email,
              full_name: user.full_name,
            })
            const photo = await Photo.create({
                title: "coba",
                caption: "coba",
                poster_image_url: "coba.com",
                UserId: id,
              })
              photoId = photo.id
            const komen = await Comment.create({
                comment: "komen",
                photoId,
            })
            commentId = komen.id
        }catch(err){
            console.log(err)
        }
    })
    afterAll(async()=>{
        try{
            await User.destroy({where: {}})
            await Photo.destroy({where: {}})
            await Comment.destroy({where: {}})
        }catch(err){
            console.log(err)
        }
    })

    it("should response with 200 statuscode",(done) =>{
        request(app)
            .delete("/comments/"+ commentId)
            .set("token", token)
            .end(function(err,res){
                if(err){
                    done(err)
                }
                expect(res.status).toEqual(200)
                expect(res.statusType).toEqual(2)
                expect(res.type).toEqual("application/json")
                expect(res.body).toHaveProperty("message")
                expect(typeof res.body).toEqual("object")
                expect(res.body.message).toEqual(
                    "Your comment has been sucsessfully deleted"
                )
                done()
            })
    })
    it("should response with 401 token not available statuscode",(done)=>{
        request(app)
            .delete("/comments/"+commentId)
            .end(function (err,res){
                if(err){
                    done(err)
                }

                expect(res.status).toEqual(401)
                expect(res.statusType).toEqual(4)
                expect(res.type).toEqual("application/json")
                expect(res.unauthorized).toEqual(true)
                expect(res.body).toHaveProperty("name")
                expect(res.body).toHaveProperty("message")
                expect(res.body.name).toEqual("JsonWebTokenError")
                expect(res.body.message).toEqual("jwt must be provided")
                done()
            })
    })
})

//bagaimana cara membuat testcase yang berhasil
//apa saja yang disiapkan sebelum dan sesudah testcase berjalan
//apa luaran yang diharapkan dari test tersebut