interface Param {
  id: number;
  name: string;
  type: "string";
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Color {
  id: number;
  name: string;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}

interface Props {
  params: Param[];
  model: Model;
}

interface State {
  model: Model;
}

class ParamEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      model: props.model,
    };
  }

  private getParamValue(paramId: number): string {
    const paramValue = this.state.model.paramValues.find(
      (paramValue) => paramValue.paramId === paramId
    );
    return paramValue ? paramValue.value : "";
  }

  private handleParamChange(paramId: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const paramValues = this.state.model.paramValues.map((paramValue) =>
        paramValue.paramId === paramId ? { ...paramValue, value } : paramValue
      );
      this.setState({
        model: {
          ...this.state.model,
          paramValues,
        },
      });
    };
  }

  public render() {
    return (
      <div>
        {this.props.params.map((param) => (
          <div key={param.id}>
            <label>{param.name}</label>
            <input
              type="text"
              value={this.getParamValue(param.id)}
              onChange={this.handleParamChange(param.id)}
            />
          </div>
        ))}
      </div>
    );
  }

  public getModel(): Model {
    return this.state.model;
  }
}
