import { Repository } from "typeorm";

export class Query {
  repository: Repository<any>;
  constructor() {}

  public async qGetPersonById(
    repository: Repository<any>,
    personType: string,
    personId: number
  ): Promise<any> {
    return await repository
      .createQueryBuilder("person")
      .innerJoinAndSelect("person." + personType, personType)
      .where("person.id = :id", { id: personId })
      .getOne();
  }

  public async qGetTypedPersonById(
    repository: Repository<any>,
    personType: string,
    personId: number
  ): Promise<any> {
    return await repository
      .createQueryBuilder(personType)
      .where("personId = :id", { id: personId })
      .getOne();
  }

  public async qGetPersons(
    repository: Repository<any>,
    personType: string
  ): Promise<any> {
    return await repository
      .createQueryBuilder("person")
      .innerJoinAndSelect("person." + personType, personType)
      .getMany();
  }
}
