import { resolve } from 'path';
import { AppError } from './../errors/AppError';
import { getCustomRepository, IsNull } from 'typeorm';
import { Request, Response } from 'express';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import SendEmailService from '../services/SendEmailService';
import { UsersRepository } from '../repositories/UseresRepository';


class AnswerController {

    async execute(req: Request, res: Response){
        const { value } = req.params
        const { u } = req.query

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)
        const surveyUser = await surveysUsersRepository.findOne({id: String(u)})
        const user = getCustomRepository(UsersRepository)
        const userEmail = await user.findOne({id:surveyUser.user_id})
        if(!surveyUser){
            throw new AppError("Survey user dos not exists")
            
            
        }
        

        surveyUser.value = Number(value)

        await surveysUsersRepository.save(surveyUser)

        const npsPath = resolve(__dirname, '..', "views", "emails", "thanksMail.hbs")
        const variables = {
            name: userEmail.name,
            title: "Obrigado Por Responder a Nossa Pesquisa"
            
        }
        await SendEmailService.execute(userEmail.email, "Resposta recebida!", variables, npsPath)

        return res.json(surveyUser)
    }

}

export {AnswerController}