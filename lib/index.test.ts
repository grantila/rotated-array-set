import { arrayEqual, rotatedArrayEqual, RotatedArraySet } from './index'


describe( "arrayEqual", ( ) =>
{
	it( "should handle diffently sized arays", ( ) =>
	{
		expect( arrayEqual( [ 'a', 'c' ], [ 'b' ] ) ).toBe( false );
	} );

	it( "should handle two empty arrays", ( ) =>
	{
		expect( arrayEqual( [ ], [ ] ) ).toBe( true );
	} );

	it( "should same-size different arrays", ( ) =>
	{
		expect( arrayEqual( [ 'a', 'b' ], [ 'a', 'c' ] ) ).toBe( false );
	} );

	it( "should same-size equal arrays", ( ) =>
	{
		expect( arrayEqual( [ 'a', 'b' ], [ 'a', 'b' ] ) ).toBe( true );
	} );
} );

describe( "rotatedArrayEqual", ( ) =>
{
	it( "should handle diffently sized arays", ( ) =>
	{
		expect( rotatedArrayEqual( [ 'a', 'c' ], [ 'b' ] ) ).toBe( false );
	} );

	it( "should handle two empty arrays", ( ) =>
	{
		expect( rotatedArrayEqual( [ ], [ ] ) ).toBe( true );
	} );

	it( "should same-size different arrays (begins with same entry)", ( ) =>
	{
		expect( rotatedArrayEqual( [ 'a', 'b' ], [ 'a', 'c' ] ) )
			.toBe( false );
	} );

	it( "should same-size different arrays", ( ) =>
	{
		expect( rotatedArrayEqual( [ 'a', 'b' ], [ 'x', 'c' ] ) )
			.toBe( false );
	} );

	it( "should same-size equal unrotated arrays", ( ) =>
	{
		expect( rotatedArrayEqual( [ 'a', 'b', 'c' ], [ 'a', 'b', 'c' ] ) )
			.toBe( true );
	} );

	it( "should same-size equal rotated arrays", ( ) =>
	{
		expect( rotatedArrayEqual( [ 'a', 'b', 'c' ], [ 'c', 'a', 'b' ] ) )
			.toBe( true );
	} );
} );

describe( "RotatedArraySet", ( ) =>
{
	it( "should handle rotated arrays incl empty strings", ( ) =>
	{
		const arraySet = new RotatedArraySet< string >( );

		arraySet.add( [ 'a', '', 'b' ] );
		arraySet.add( [ '', '' ] );
		arraySet.add( [ ] );
		arraySet.add( [ '', '' ] );
		arraySet.add( [ ] );
		arraySet.add( [ 'b', 'a', '' ] );

		expect( arraySet.values( ) ).toStrictEqual( [
			[ 'a', '', 'b' ],
			[ '', '' ],
			[ ],
		] );
	} );

	it( "should handle rotated arrays", ( ) =>
	{
		const arraySet = new RotatedArraySet< string >( );

		arraySet.add( [ 'a', 'b' ] );
		arraySet.add( [ 'a', 'b', 'c' ] );
		arraySet.add( [ 'b', 'c', 'a' ] );
		arraySet.add( [ 'b', 'a' ] );

		expect( arraySet.values( ) ).toStrictEqual( [
			[ 'a', 'b' ],
			[ 'a', 'b', 'c' ],
		] );
	} );

	it( "should handle has()", ( ) =>
	{
		const arraySet = new RotatedArraySet< string >( );

		expect( arraySet.has( [ 'a', 'b' ] ) ).toBe( false );
		arraySet.add( [ 'a', 'b' ] );
		expect( arraySet.has( [ 'a', 'b' ] ) ).toBe( true );

		expect( arraySet.has( [ 'a', 'b', 'c' ] ) ).toBe( false );
		arraySet.add( [ 'a', 'b', 'c' ] );
		expect( arraySet.has( [ 'a', 'b', 'c' ] ) ).toBe( true );

		arraySet.add( [ 'b', 'c', 'a' ] );
		expect( arraySet.has( [ 'a', 'b', 'c' ] ) ).toBe( true );

		arraySet.add( [ 'b', 'a' ] );
		expect( arraySet.has( [ 'a', 'b' ] ) ).toBe( true );

		expect( arraySet.has( [ 'foo', 'bar' ] ) ).toBe( false );

		expect( arraySet.values( ) ).toStrictEqual( [
			[ 'a', 'b' ],
			[ 'a', 'b', 'c' ],
		] );
	} );

	it( "should handle rotated arrays of long strings", ( ) =>
	{
		const arraySet = new RotatedArraySet< string >( );

		arraySet.add( [ 'a long string', 'another long' ] );
		arraySet.add( [ 'a', 'very long', 'set of strings' ] );
		arraySet.add( [ 'very long', 'set of strings', 'a' ] );
		arraySet.add( [ 'another long', 'a long string' ] );

		expect( arraySet.values( ) ).toStrictEqual( [
			[ 'a long string', 'another long' ],
			[ 'a', 'very long', 'set of strings' ],
		] );
	} );

	it( "should handle delete arrays", ( ) =>
	{
		const arraySet = new RotatedArraySet< string >( );

		arraySet.add( [ 'a', 'b' ] );
		arraySet.add( [ 'a', 'b', 'c' ] );
		arraySet.add( [ 'b', 'c', 'a' ] );
		arraySet.add( [ 'b', 'a' ] );
		expect( arraySet.delete( [ 'c', 'a', 'b' ] ) ).toBe( true );
		expect( arraySet.delete( [ 'foo', 'bar' ] ) ).toBe( false );

		expect( arraySet.values( ) ).toStrictEqual( [
			[ 'a', 'b' ],
		] );
	} );
} );
