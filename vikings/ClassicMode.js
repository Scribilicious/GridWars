const Action = require('./Action');

function gameUpdate() {
    const game = this;

    function handleVikingAttack(viking) {
        try {
            const attackPosition = viking.getActionPosition();
            const otherViking = game.findVikingByPosition(attackPosition);

            if (otherViking) {
                otherViking.health -= viking.level;

                if (otherViking.isDead()) {
                    viking.kills += 1;
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    function handleVikingMove(viking) {
        try {
            const movePosition = viking.getActionPosition();
            const otherViking = game.findVikingByPosition(movePosition);

            if (otherViking) {
                throw new Error(`${viking.id} something is in my way`);
            }

            viking.position = movePosition;
        } catch (e) {
            console.log(e);
        }
    }

    function handleVikingHeal(viking) {
        try {
            viking.increaseHitPoints(viking.level);
        } catch (e) {
            console.log(e);
        }
    }

    // ATTACK
    {
        const vikings = game.findVikingsByOrder(Action.ORDER_ATTACK);

        vikings.forEach(viking => {
            handleVikingAttack(viking);
        });

        game.disposeBodies();
        game.levelUpVikings();
    }

    // MOVE
    {
        const vikings = game.findVikingsByOrder(Action.ORDER_MOVE);

        vikings.forEach(viking => {
            handleVikingMove(viking);
        });
    }

    // HEAL
    {
        const vikings = game.findVikingsByOrder(Action.ORDER_HEAL);

        vikings.forEach(function(viking) {
            handleVikingHeal(viking);
        });
    }

    game.resetVikingsOrders();
    game.emit('vikingsUpdate', { vikings: game.parseVikings() });
}
module.exports = gameUpdate;
