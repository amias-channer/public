import React from 'react';
import { Input } from 'reactstrap';
import AbstractForm from '../../../../Forms/AbstractForm';
import CheckboxInput from '../../../../CheckboxInput';

class NotificationOptionsForm extends AbstractForm {
  render() {
    return (
      <div className="NotificationOptionsForm">
        <ul>
          <li>
            <CheckboxInput />
            der Worst-of Basiswert
            <Input type="text" />
            % von der Barriere entfernt ist (
            <strong>Barriere-Abstand</strong>
            )
          </li>
          <li>
            <CheckboxInput />
            ein Basiswert die Barriere berührt hat (
            <strong>Barriere berührt</strong>
            )
          </li>
          <li>
            <CheckboxInput />
            das Produkt
            <Input type="text" />
            % erreicht hat (
            <strong>Produktpreis</strong>
            )
          </li>
          <li>
            <CheckboxInput />
            das Produkt eine Rendite von
            <Input type="text" />
            erreicht hat (
            <strong>Rendite</strong>
            )
          </li>
          <li>
            <CheckboxInput />
            das Produkt
            <Input type="text" />
            Handelstage vor dem Verfall ist (
            <strong>Verfall</strong>
            )
          </li>
        </ul>
      </div>
    );
  }
}

export default NotificationOptionsForm;
