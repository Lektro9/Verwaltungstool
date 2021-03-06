
const isProduction = () => {
    const mode = process.argv[2];
    return mode !== 'dev';
}

module.exports = {
    "type": "sqlite",
    "database": "personenverwaltung.sqlite",
    "synchronize": true,
    "logging": false,
    "entities": [
        isProduction() ?
            "build/**/*.js" :
            "./model/*.ts"
    ],
    "migrations": [
        "./migration/**/*.ts"
    ],
    "subscribers": [
        "./subscriber/**/*.ts"
    ],
    "cli": {
        "entitiesDir": "./model",
        "migrationsDir": "./migration",
        "subscribersDir": "./subscriber"
    }
}

