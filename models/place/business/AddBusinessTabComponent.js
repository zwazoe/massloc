import React, { Component } from 'react';
import { Button, message, Popover, Row, Col, Input } from 'antd';
import createHistory from 'history/createBrowserHistory';

const { InputGroup } = Input;

const history = createHistory({ forceRefresh: true });

class AddBusinessTabComponent extends Component {
	handleDone = () => {
		this.props.handleSubmit();
	};

	render() {
		return (
			<div>
				<h3 style={{ marginTop: 20, marginBottom: 0 }}>
					{this.props.title}{' '}
					<Popover content={<div>{this.props.help}</div>} title={this.props.title} trigger="click">
						<Button type="dashed" icon="question-circle-o">
							{' '}
							Help
						</Button>
					</Popover>
				</h3>
				<p style={{ marginBottom: 20 }}> {this.props.description} </p>
				<div className="steps-content">{this.props.content} </div>
				<div className="steps-action">
					<InputGroup style={{ marginBottom: '15px' }}>
						<Row gutter={24} style={{ marginTop: 8 }}>
							<Col span="8" />
							{this.props.isDisplayPrevious && (
								<Col span="8">
									<Button
										className="fullButton square"
										style={{ marginRight: 8 }}
										onClick={this.props.handlePrevious}
									>
										Previous
									</Button>
								</Col>
							)}
							{this.props.isDisplayNext && (
								<Col span="8">
									<Button
										className="fullButton square"
										type="primary"
										style={{ marginRight: 8 }}
										onClick={this.props.handleNext}
										disabled={this.props.isDisabledNext}
									>
										Next
									</Button>
								</Col>
							)}

							{this.props.isDisplayDone && (
								<Col span="8">
									<Button
										className="fullButton square"
										type="primary"
										style={{ marginRight: 8 }}
										onClick={this.handleDone}
										disabled={this.props.isDisabledDone}
									>
										<span>Done</span>
									</Button>
								</Col>
							)}
						</Row>
					</InputGroup>
				</div>
			</div>
		);
	}
}

export default AddBusinessTabComponent;
