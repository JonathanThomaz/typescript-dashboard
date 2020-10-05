import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons

import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
// core components
import GridItem from "../../components/Grid/GridItem";
import GridContainer from "../../components/Grid/GridContainer";
import Table from "../../components/Table/Table";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardIcon from "../../components/Card/CardIcon";
import CardBody from "../../components/Card/CardBody";
import CardFooter from "../../components/Card/CardFooter";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from "../../variables/charts";

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle";
import api from "../../services/api";

type apiResponse = {
  coord: {
    lon: number,
    lat: number
  },
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>,
  base: string,
  main: {
    temp: string,
    feels_like: number,
    temp_min: number,
    temp_max: number,
    pressure: number,
    humidity: number
  },
  visibility: number,
  wind: {
    speed: number,
    deg: number
  },
  clouds: {
    all: number
  },
  dt: number,
  sys: {
    type: number,
    id: number,
    message: number,
    country: string,
    sunrise: number,
    sunset: number
  },
  timezone: number,
  id: number,
  name: string,
  cod: number
}

interface Props {
  classes: any;
}

interface State {
  data?: apiResponse;
  value: number;
  creatingMessage: boolean;
  messageSuccess: boolean;
  messageFailed: boolean
}

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: 0,
      creatingMessage: false,
      messageSuccess: true,
      messageFailed: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
  }

  async componentDidMount() {
    let key: string = 'weather?appid=61434153740b83810657224b0bb29657';
    const response = await api.get(`${key}&q=juiz+de+fora&lang=pt&units=metric&mode=JSON`);
    //const dailysResponse = await api.get(`${key}&q=juiz+de+fora&lang=pt&units=metric&mode=JSON`);
    const data: apiResponse = await response.data;
    this.setState({ data: data })
  };
  handleChange = (event: any, value: number) => {
    this.setState({ value });
  };

  hadleUTCTime = (timeXML: any) => {
    let sec: number = timeXML;
    let date: Date = new Date(sec * 1000);
    return date;
  }
  handleChangeIndex = (index: number) => {
    this.setState({ value: index });
  };
  handleUrlIconTemp = () => {
    let url: string;
    let iconId = this.state.data?.weather.map(item => item.icon);
    url = `http://openweathermap.org/img/wn/${iconId}@2x.png`;
    return url;

  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader stats={true} icon={true}>
                <CardIcon color="info">
                  <img src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Brasao-jf.png' alt="Brasão Juiz de Fora" width="50" height="50" />

                </CardIcon>
                <h1 className={classes.cardTitle}>{this.state.data?.name}</h1>
              </CardHeader>
              <CardFooter>
                <p>{this.hadleUTCTime(this.state.data?.dt).toLocaleString()}</p>
              </CardFooter>
            </Card>

          </GridItem>
          <GridItem xs={3} sm={6} >
            <Card>
              <CardHeader color="info" stats={true} icon={true}>
                <CardIcon color="info">
                  <img src='https://www.flaticon.com/svg/static/icons/svg/941/941818.svg' alt="Nascer do Sol" width="50" height="50" />

                </CardIcon>
                <p className={classes.cardCategory}>Nascer do Sol</p>
                <h3 className={classes.cardTitle}>{this.hadleUTCTime(this.state.data?.sys.sunrise).toLocaleTimeString()}</h3>
              </CardHeader>
            </Card>
          </GridItem>
          <GridItem xs={3} sm={6} >
            <Card>
              <CardHeader color="warning" stats={true} icon={true}>
                <CardIcon color="warning">
                  <img src='https://www.flaticon.com/svg/static/icons/svg/1542/1542641.svg' alt="Por do Sol" width="50" height="50" />
                </CardIcon>
                <p className={classes.cardCategory}>Por do Sol</p>
                <h3 className={classes.cardTitle}>
                  {this.hadleUTCTime(this.state.data?.sys.sunset).toLocaleTimeString()}
                </h3>
              </CardHeader>
            </Card>
          </GridItem>
          <GridItem xs={3} sm={6} >
            <Card>
              <CardHeader color="danger" stats={true} icon={true}>
                <CardIcon color="danger">
                  <img src={this.handleUrlIconTemp()} alt="Por do Sol" width="50" height="50" />
                </CardIcon>
                <p className={classes.cardCategory}>Tempo</p>
                <h3 className={classes.cardTitle}>{this.state.data?.main.temp}ºC</h3>
              </CardHeader>
              <CardFooter stats={true}>
                <div className={classes.stats}>
                  <LocalOffer />
                  {this.state.data?.weather.map(item => item.description)}
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={3} sm={6} >
            <Card>
              <CardHeader color="info" stats={true} icon={true}>
                <CardIcon color="info">
                  <Accessibility />
                </CardIcon>
                <p className={classes.cardCategory}>Sensação Térmica</p>
                <h3 className={classes.cardTitle}>{this.state.data?.main.feels_like}ºC</h3>
              </CardHeader>
              <CardFooter stats={true}>
                <div className={classes.stats}>
                  <Update />
                  Humidade Relativa do ar: {this.state.data?.main.humidity}%
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <Card chart={true}>
              <CardHeader color="success">
                <ChartistGraph
                  className="ct-chart"
                  data={dailySalesChart.data}
                  type="Line"
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Daily Sales{console.log("olha", this.hadleUTCTime(1601906400))}</h4>
                <p className={classes.cardCategory}>
                  <span className={classes.successText}>
                    <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                  </span>{" "}
                  increase in today sales.
                </p>
              </CardBody>
              <CardFooter chart={true}>
                <div className={classes.stats}>
                  <AccessTime /> updated 4 minutes ago
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card chart={true}>
              <CardHeader color="warning">
                <ChartistGraph
                  className="ct-chart"
                  data={emailsSubscriptionChart.data}
                  type="Bar"
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Email Subscriptions</h4>
                <p className={classes.cardCategory}>
                  Last Campaign Performance
                </p>
              </CardBody>
              <CardFooter chart={true}>
                <div className={classes.stats}>
                  <AccessTime /> campaign sent 2 days ago
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card chart={true}>
              <CardHeader color="danger">
                <ChartistGraph
                  className="ct-chart"
                  data={completedTasksChart.data}
                  type="Line"
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Completed Tasks</h4>
                <p className={classes.cardCategory}>
                  Last Campaign Performance
                </p>
              </CardBody>
              <CardFooter chart={true}>
                <div className={classes.stats}>
                  <AccessTime /> campaign sent 2 days ago
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12}>
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>Employees Stats</h4>
                <p className={classes.cardCategoryWhite}>
                  New employees on 15th September, 2016
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="warning"
                  tableHead={["ID", "Name", "Salary", "Country"]}
                  tableData={[
                    ["1", "Dakota Rice", "$36,738", "Niger"],
                    ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                    ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                    ["4", "Philip Chaney", "$38,735", "Korea, South"],
                  ]}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div >
    );
  }
}

export default withStyles(dashboardStyle)(Dashboard);
