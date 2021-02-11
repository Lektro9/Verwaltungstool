"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
class Query {
    constructor() { }
    async qGetPersonById(repository, personType, personId) {
        return await repository
            .createQueryBuilder("person")
            .innerJoinAndSelect("person." + personType, personType)
            .where("person.id = :id", { id: personId })
            .getOne();
    }
    async qGetTypedPersonById(repository, personType, personId) {
        return await repository
            .createQueryBuilder(personType)
            .where("personId = :id", { id: personId })
            .getOne();
    }
    async qGetPersons(repository, personType) {
        return await repository
            .createQueryBuilder("person")
            .innerJoinAndSelect("person." + personType, personType)
            .getMany();
    }
}
exports.Query = Query;
//# sourceMappingURL=query.js.map