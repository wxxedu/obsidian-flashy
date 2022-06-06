import * as React from 'react';
import InfoView from './InfoView';
import Card from './Card';
import Button from './Button';
import CardManager from 'src/models/card_manager';

interface CardsParams {
    manager: CardManager,
}

export default function Cards(params: CardsParams) {
    let [state, setState] = React.useState<CardManager>(params.manager);

    let handleFinish = () => {
        setState(state.moveToNextCard());
    }

    if (state.hasFinished()) {
        return (
            <div className="flashy-cards-finished">
                <InfoView title="Finished!" message="You have finished all the cards in this document!" />
            </div>
        );
    }
    return (
        <div className="flashy-cards-view">
            <Card model={state.getCurrentCard()} onFinish={handleFinish} />
        </div>
    )
}
