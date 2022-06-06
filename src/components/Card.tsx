import * as React from "react";
import CardModel from "src/models/card_model";
import Button from "./Button";
import IconButton from "./IconButton";
import MarkdownView from "./MarkdownView";
import { RiArrowGoBackFill } from "react-icons/ri";
const BUTTON_WIDTH: number = 120;

interface CardParams {
    model: CardModel
    onFinish?: () => void
}

export default function Card(params: CardParams) {
    let [state, setState] = React.useState({ hasAnswered: false, });

    let checkAnswer = () => { 
        setState({ hasAnswered: true, });
    }

    let handleAnswer = (answer?: string) => {
        if (answer != null) {
            params.model.addReviewEntryWithAnswer(answer);
        }
        setState({ hasAnswered: false, });
        params.onFinish?.call(null);
    }

    let handleBack = () => {
        setState({ hasAnswered: false, });
    }

    if (!state.hasAnswered) {        
        return (
            <div className="flashy-card">
                <MarkdownView markdown={params.model.front} sourcePath={params.model.sourcePath} />
                <div className="flashy-centered">
                <Button title="Check Answer"  width={BUTTON_WIDTH} onClick={checkAnswer} />
                </div>
            </div>
        )
    } else {
        return (
            <div className="flashy-card">
                <div className="flashy-floating-action-button">
                    <IconButton icon={RiArrowGoBackFill} onClick={handleBack} />
                </div>
                <MarkdownView markdown={params.model.back} sourcePath={params.model.sourcePath} />
                <div className="flashy-centered">
                    <div className="flashy-row">
                        <Button title="Skip" width={BUTTON_WIDTH}  onClick={()=>handleAnswer()} backgroundColor="transparent" color="grey" />
                        <Button title="Wrong" width={BUTTON_WIDTH}  onClick={()=>handleAnswer("Wrong")} backgroundColor="red" />
                        <Button title="Correct" width={BUTTON_WIDTH} onClick={()=>handleAnswer("Correct")} backgroundColor="green" />
                    </div>
                </div>
            </div>
        )
    }
}
