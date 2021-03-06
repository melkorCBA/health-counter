import { Request, Response } from 'express';
import insufficientParameter from '../modules/common/services/insufficient-parameter';
import { gender, response_status_codes } from '../modules/common/models/common.model';
import { FamilyService } from '../modules/family/services/family.service';
import { IFamily, IGetFamily } from '../modules/family/models/family.model';
import internalServerError from '../modules/common/services/internal-server-error';
import { IPerson, IGetPreson } from '../modules/person/models/person.model';
import { PersonService } from '../modules/person/services/person.service';

export class UserController {

    private family_service: FamilyService = new FamilyService();
    private person_service: PersonService = new PersonService();

    public create_family_details(req: Request, res: Response) {
        if (req.body.is_aboard !== null && req.body.is_aboard !== undefined &&
            req.body.n_family_members &&
            req.body.is_patient_contacted !== null && req.body.is_patient_contacted !== undefined) {
            const family: IFamily = {
                n_family_members: req.body.n_family_members,
                is_aboard: req.body.is_aboard,
                is_patient_contacted: req.body.is_patient_contacted
            }
            this.family_service.createFamily(family, (err: any, family_data: IGetFamily) => {
                if (err) {
                    internalServerError(err, res);
                } else {
                    res.status(response_status_codes.success).json({
                        STATUS: 'SUCCESS',
                        MESSAGE: 'Family details added successfully',
                        DATA: { id: family_data._id }
                    });
                }
            });
        } else {
           
            insufficientParameter(res);
        }

    }

    public save_person_details(req: Request, res: Response) {
        if (req.body.id && req.body.bucket_index && req.body.age && req.body.gender && req.body.symptomsList && req.body.symptomsList.length !== 0) {
            const person: IPerson = {
                family_id: req.body.id,
                bucket_index: req.body.bucket_index,
                age: req.body.age,
                gender: req.body.gender,
                symptomsList: req.body.symptomsList
            }
            const filter = { family_id: person.family_id, bucket_index: person.bucket_index };
            this.person_service.filter(filter, (err: any, data_of_person: IGetPreson) => {
                if (err) {
                    internalServerError(err, res);
                } else if (data_of_person) {
                    this.person_service.updatePerson(data_of_person._id, person, (err: any) => {
                        if (err) {
                            internalServerError(err, res);
                        } else {
                            res.status(response_status_codes.success).json({
                                STATUS: 'SUCCESS',
                                MESSAGE: 'Person details updated successfully',
                                DATA: {}
                            });
                        }
                    });
                } else {
                    this.person_service.createPerson(person, (err: any) => {
                        if (err) {
                            internalServerError(err, res);
                        } else {
                            res.status(response_status_codes.success).json({
                                STATUS: 'SUCCESS',
                                MESSAGE: 'Person details added successfully',
                                DATA: {}
                            });
                        }
                    });
                }
            });
        } else {
            insufficientParameter(res);
        }
    }
}