import * as React from 'react';

import { Row, Col } from 'antd';

import AttributeCombo from '../AttributeCombo/AttributeCombo';
import OperatorCombo from '../OperatorCombo/OperatorCombo';
import TextFilterField from '../TextFilterField/TextFilterField';
import NumberFilterField from '../NumberFilterField/NumberFilterField';

import { ComparisonFilter, ComparisonOperator } from 'geostyler-style';

import './ComparisonFilter.css';
import BoolFilterField from '../BoolFilterField/BoolFilterField';

// default props
interface DefaultComparisonFilterProps {}
// non default props
interface ComparisonFilterProps extends Partial<DefaultComparisonFilterProps> {
  internalDataDef: any;
  onFilterChange: ((compFilter: ComparisonFilter) => void);
}
// state
interface ComparisonFilterState {
  textFieldVisible: boolean;
  numberFieldVisible: boolean;
  boolFieldVisible: boolean;
  selectedAttribute: string;
}

/**
 * UI for a ComparisonFilter consisting of
 *
 *   - A combo to select the attribute
 *   - A combo to select the operator
 *   - An input field for the value
 */
class ComparisonFilterUi extends React.Component<ComparisonFilterProps, ComparisonFilterState> {

  /** The currently selected filter attribute */
  attribute: string;

  /** The type of the currently selected filter attribute */
  attributeType: string;

  /** The currently selected filter operator */
  operator: ComparisonOperator;

  /** The currently entered filter value */
  value: string | number | boolean | null;

  constructor(props: ComparisonFilterProps) {
    super(props);

    this.state = {
      textFieldVisible: true,
      numberFieldVisible: false,
      boolFieldVisible: false,
      selectedAttribute: ''
    };
  }

  /**
   * Handler function, which is executed, when to underlying filter attribute changes.
   *
   * Changes the input field for the filter value and stores the appropriate attribute name as member.
   */
  onAttributeChange = (newAttrName: string) => {

    this.attribute = newAttrName;
    this.setState({selectedAttribute: newAttrName});

    // read out attribute type
    const attrDefs = this.props.internalDataDef.schema.properties;
    const attrType = attrDefs[newAttrName].type;

    // toggle visibility due to attribute's type
    if (attrType === 'string') {
      this.setState({
        textFieldVisible: true,
        numberFieldVisible: false,
        boolFieldVisible: false
      });
    } else if (attrType === 'number') {
      this.setState({
        textFieldVisible: false,
        numberFieldVisible: true,
        boolFieldVisible: false
      });
    } else if (attrType === 'boolean') {
      this.setState({
        textFieldVisible: false,
        numberFieldVisible: false,
        boolFieldVisible: true
      });
    }

    // reset the filter value when the attribute type changed
    if (attrType !== this.attributeType) {
      delete this.value;
    }

    // preserve the attribute type to compare with new one
    this.attributeType = attrType;

    // (re)create the ComparisonFilter object
    this.createGsFilter();
  }

  /**
   * Handler function, which is executed, when to underlying filter operator changes.
   *
   * Stores the appropriate operator as member.
   */
  onOperatorChange = (newOperator: ComparisonOperator) => {
    this.operator = newOperator;

    // (re)create the ComparisonFilter object
    this.createGsFilter();
  }

  /**
   * Handler function, which is executed, when to underlying filter value changes.
   *
   * Stores the appropriate filter value as member.
   */
  onValueChange = (newValue: string | boolean) => {
    this.value = newValue;

    // (re)create the ComparisonFilter object
    this.createGsFilter();
  }

  /**
   * Creates a GeoStyler ComparisonFilter object and passes it to the 'onFilterChange' function.
   */
  createGsFilter = () => {
    const compFilter: ComparisonFilter = [
      this.operator, this.attribute, this.value
    ];

    this.props.onFilterChange(compFilter);
  }

  render() {

    return (
      <div className="gs-comparison-filter-ui">

         <Row gutter={16}>

          <Col span={10}>
            <AttributeCombo
              internalDataDef={this.props.internalDataDef}
              onAttributeChange={this.onAttributeChange}
            />
          </Col>
          <Col span={4}>
            <OperatorCombo
              internalDataDef={this.props.internalDataDef}
              onOperatorChange={this.onOperatorChange}
            />
          </Col>
          {
            this.state.textFieldVisible ?
              <Col span={10}>
                <TextFilterField internalDataDef={this.props.internalDataDef} onValueChange={this.onValueChange} />
              </Col> :
              null
          }
          {
            this.state.numberFieldVisible ?
              <Col span={10}>
                <NumberFilterField
                  internalDataDef={this.props.internalDataDef}
                  selectedAttribute={this.state.selectedAttribute}
                  onValueChange={this.onValueChange}
                />
              </Col> :
              null
          }
          {
            this.state.boolFieldVisible ?
              <Col span={10}>
                <BoolFilterField
                  internalDataDef={this.props.internalDataDef}
                  onValueChange={this.onValueChange}
                />
              </Col> :
              null
          }

        </Row>

      </div>
    );
  }
}

export default ComparisonFilterUi;