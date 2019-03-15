import * as React from 'react'

interface Props {
  hasConfirmed: boolean
  onConfirmChange: React.ChangeEventHandler<HTMLInputElement>
}

const TermsAndConditionsPresentation: React.SFC<Props> = props => (
  <div className="field">
    <div className="control">
      <input
        type="checkbox"
        className="is-checkradio"
        id="tcs"
        name="tcs"
        checked={props.hasConfirmed}
        onChange={props.onConfirmChange}
      />
      <label htmlFor="tcs">
        I agree with the{' '}
        <a href="https://kinesis.money/en/terms-of-use-and-service/" target="_blank">
          {' '}
          Terms of Service
        </a>
      </label>
    </div>
  </div>
)

export { TermsAndConditionsPresentation as TermsAndConditions }
