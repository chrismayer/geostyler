/* Released under the BSD 2-Clause License
 *
 * Copyright © 2018-present, terrestris GmbH & Co. KG and GeoStyler contributors
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

import * as React from 'react';

import { ComparisonOperator } from 'geostyler-style';
import { Select, Form } from 'antd';
import { Data } from 'geostyler-data';
import _indexOf from 'lodash/indexOf';
const Option = Select.Option;

// default props
interface OperatorComboDefaultProps {
  /** Label for this field */
  label: string;
  /** Show title of selected item */
  showTitles: boolean;
  /** The default text to place into the empty field */
  placeholder: string;
  /** Initial value set to the field */
  value: ComparisonOperator | undefined;
  /** List of operators to show in this combo */
  operators: string[];
  /** Mapping function for operator names in this combo */
  operatorNameMappingFunction: (originalOperatorName: string) => string;
  /** Mapping function for operator title in this combo */
  operatorTitleMappingFunction: (originalOperatorName: string) => string;
  /** Validation status */
  validateStatus: 'success' | 'warning' | 'error' | 'validating';
  /** Element to show a help text */
  help: React.ReactNode;
}
// non default props
export interface OperatorComboProps extends Partial<OperatorComboDefaultProps> {
  /** Reference to internal data object (holding schema and example features) */
  internalDataDef: Data;
  /** Callback function for onChange */
  onOperatorChange: ((newOperator: ComparisonOperator) => void);
}

interface OperatorState {
  value: ComparisonOperator | undefined;
}

/**
 * Combobox offering different filter operators.
 */
export class OperatorCombo extends React.Component<OperatorComboProps, OperatorState> {

  public static defaultProps: OperatorComboDefaultProps = {
    label: 'Operator',
    showTitles: true,
    placeholder: 'Select Operator',
    value: undefined,
    operators: ['==', '*=', '!=', '<', '<=', '>', '>='],
    operatorNameMappingFunction: n => n,
    operatorTitleMappingFunction: t => t,
    validateStatus: 'error',
    help: 'Please select an operator.'
  };

  constructor(props: OperatorComboProps) {
    super(props);
    this.state = {
      value: this.props.value
    };
  }

  static getDerivedStateFromProps(
    nextProps: OperatorComboProps,
    prevState: OperatorState): Partial<OperatorState> {

    let value: ComparisonOperator | undefined = nextProps.value;

    // check if we have to change value according to new allowed operators
    if (nextProps.operators) {
      if (_indexOf(nextProps.operators, nextProps.value) === -1) {
        // current operator is not in allowed list, so we use an allowed one
        value = nextProps.operators[0] as ComparisonOperator;
      }
    }

    return {
      value: value
    };
  }

  render() {

    let options: Object[] = [];
    const operators = this.props.operators || ['==', '*=', '!=', '<', '<=', '>', '>='];

    // create an option per attribute
    options = operators.map(operator => {
      const title = this.props.showTitles
        ? this.props.operatorTitleMappingFunction(operator)
        : ' ';

      return (
        <Option
          key={operator}
          value={operator}
          title={title}
        >
          {this.props.operatorNameMappingFunction(operator)}
        </Option>
      );
    });

    const helpTxt = this.props.validateStatus !== 'success' ? this.props.help : null;

    return (
      <div className="gs-operator-combo">
        <Form.Item
          label={this.props.label}
          colon={false}
          validateStatus={this.props.validateStatus}
          help={helpTxt}
        >
          <Select
            value={this.state.value}
            style={{ width: '100%' }}
            onChange={this.props.onOperatorChange}
            placeholder={this.props.placeholder}
          >
            {options}
          </Select>

        </Form.Item>

      </div>
    );
  }
}

export default OperatorCombo;
