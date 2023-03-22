const https = require('https')

class Food {
    constructor(n, id, energy, carbs, protein, fat) {
        this.name = n
        this.id = id
        this.health = energy
        this.attack = carbs
        this.defence = protein
        this.delay = carbs + protein + fat
        this.internalTime = 0
    }

    getName() { return this.name }
    getId() { return this.id }
    getHealth() { return this.health }
    getAttack() { return this.attack }
    getDefence() { return this.defence }
    getDelay() { return this.delay }
    getInternalTime() { return this.internalTime }

    increaseInternalTime() { this.internalTime += this.delay }
    receiveDamage(damage) {
        this.health -= damage
    }

    static attack(attacker, defensor) {
        let dmg = (attacker.getAttack() * (100 - defensor.getDefence())) / 100
        defensor.receiveDamage(dmg)
        return dmg
    }
}

function getFoodData(id) {
    return new Promise((resolve, reject) => {
        let url = 'https://fineli.fi/fineli/api/v1/foods/' + id
        https.get(url, res => {
            let data = [];
            const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
            console.log('Status Code:', res.statusCode);
            console.log('Date in Response header:', headerDate);

            res.on('data', chunk => {
                data.push(chunk);
            });

            res.on('end', () => {
                console.log('Response ended: ');
                const parsedData = JSON.parse(Buffer.concat(data).toString());

                resolve([parsedData.name.fi,
                parsedData.id,
                parsedData.energy,
                parsedData.carbohydrate,
                parsedData.protein,
                parsedData.fat])
            });
        }).on('error', err => {
            console.log('Error: ', err.message);
        });
    }
    )
}

function fight(fighterA, fighterB) {
    let fightLog = [] //Array of objects {timestamp,attackerId,attackerName,attackerHealth,damage,defensorId,defensorName,defensorHealth}
    fighterA.increaseInternalTime()
    fighterB.increaseInternalTime()

    while (fighterA.getHealth() > 0 && fighterB.getHealth() > 0) {
        let attacker
        let defensor
        if (fighterA.getInternalTime() < fighterB.getInternalTime()) {
            attacker = fighterA
            defensor = fighterB
        } else {
            attacker = fighterB
            defensor = fighterA
        }

        let lineObject = {}
        let dmg = Food.attack(attacker, defensor)

        lineObject.timestamp = ((Math.round(attacker.getInternalTime() * 100) / 100))
        lineObject.attackerId = attacker.getId()
        lineObject.attackerName = attacker.getName()
        lineObject.attackerHealth = (Math.round(attacker.getHealth() * 100) / 100)
        lineObject.damage = (Math.round(dmg * 100) / 100)
        lineObject.defensorId = defensor.getId()
        lineObject.defensorName = defensor.getName()

        if (defensor.health <= 0) {
            lineObject.defensorHealth = 0
        } else {
            //lineText += "\n" + defensor.getName() + "lle jäi " + (Math.round(defensor.getHealth() * 100) / 100) + " Health"
            lineObject.defensorHealth = (Math.round(defensor.getHealth() * 100) / 100)
            attacker.increaseInternalTime()
        }
        fightLog.push(lineObject)
    }

    let winner
    if (fighterA.getHealth() < 0) {
        winner = fighterB
    } else {
        winner = fighterA
    }
    // timestamp missing here: fightLog.push(winner.getName() + " voitti taistelun!")

    return fightLog
}

async function initFoods(foodCode1, foodCode2) {
    const dataA = await getFoodData(foodCode1)
    const dataB = await getFoodData(foodCode2)
    let foodA = new Food(...dataA)
    let foodB = new Food(...dataB)
    const results = fight(foodA, foodB)
    return results
}

export default function handler(req, res) {
    initFoods(req.body.foodCode1, req.body.foodCode2).then((value) => res.send(value))
}